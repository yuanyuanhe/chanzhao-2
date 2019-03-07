import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import {getMoments, getUserUID} from "../../../redux/store/storeBridge";
import {
    getFocusedMoments,
    getHotMoments,
    getRecommendMoments,
    getCollectedMoments,
    getUserCenterMoments
} from '../../../requests';
import MomentItem from '../MomentItem'
import MomentEmptyPage from './MomentEmptyPage'
import {addMoments, initMoments} from "../../../redux/actions";
import {getAccountsInMoments} from "../../../util";
import {checkUsersData} from "../../../util/user";
import $ from 'jquery';
import './index.css';
import { withRouter } from 'react-router-dom';
import LoadingWithDot from "../../generics/LoadingWithDot";
import {REQUEST_ERROR} from "../../../configs/TIP_TEXTS";

/*
 * MomentFilters 有两种参数来标识页码
 * page or lasttime
 * 在热门 (hot) 中是用页码分页, 其余则是用最后一条秘圈的时间请求下一页
 */
export const MomentFilters = {
    focused: 'focused',
    hot: 'hot',
    recommend: 'recommend',
    collection: 'collection',
    user: 'user',
};

/**
 * 参数解构赋值
 * {
 *     uid,
 *     lasttime,
 *     page
 * }
 */
const requestMap = {
    [ MomentFilters.focused ]: getFocusedMoments,
    [ MomentFilters.hot ]: getHotMoments,
    [ MomentFilters.recommend ]: getRecommendMoments,
    [ MomentFilters.collection ]: getCollectedMoments,
    [ MomentFilters.user ]: getUserCenterMoments,
};
const loadMoreScrollEvent = 'scroll.momentLoadMore';
const toggleBackBtnScrollEvent = 'scroll.toggleBackBtn';
/*
 * Container of MomentList
 * 广场内数据与 redux 无关, 只是遵从相关模式
 */
class MomentProvider extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            moments: [],
            loadend: false,
            showBachBtn: false,
            params: { ...this.firstParams },
        };
    }

    // 初始化页码参数, 用于刷新
    get firstParams() {
        return {
            page: 1,
            uid: this.props.uid ? this.props.uid : getUserUID(),
            lasttime: Date.now(),
        };
    }

    componentDidMount() {
        if (  getMoments( this.props.filter ).length === 0 ) {
            this.refreshMoment()
        }
        $( '.main' ).on( loadMoreScrollEvent, this.scrollLoadMore )
        $( '.main' ).on( toggleBackBtnScrollEvent, this.toggleBackBtn )
    }

    /**
     * 判断页面内是否有秘圈列表
     * 过滤其他页面内滚动触发加载更多
    */
    inMomentProvider = () => {
        if( /moments\/user|moments\/collection|\/square\/recommend|\/square\/hot|\/square\/focused/.test( this.props.location.pathname ) ) {
            return true;
        }
        return false;
    }
    /**
     * 组件解绑时取消加载更多和返回顶部按钮显隐滚动事件监听
    */
    componentWillUnmount() {
        $( '.main' ).off( loadMoreScrollEvent );
        $( '.main' ).off( toggleBackBtnScrollEvent );
    }

    /**
     * 滚动到底部之前加载更多
    */
    scrollLoadMore = ( e ) => {
        let target = e.target;
        if ( !this.inMomentProvider() ) {
            return;
        }
        if ( target.scrollHeight - target.scrollTop < target.offsetHeight + 100 ) {
            this.nextPageClickHandler();
        }
    }

    /**
     * 根据滚动高度显示隐藏返回顶部按钮
    */
    toggleBackBtn = ( { target } ) => {
        if ( target.scrollTop > 1000 ) {
            this.setState( {
                showBachBtn: true
            } );
        } else {
            this.setState( {
                showBachBtn: false
            } );
        }
    }

    componentWillMount() {
        this.refreshMoment( this.props.filter );
    }

    /**
     * 监听秘圈类型变化 刷新秘圈
    */
    componentWillReceiveProps( nextProps ) {
        if ( nextProps.filter !== this.props.filter ) {
            this.refreshMoment( nextProps.filter );
        }
        if ( nextProps.refreshMomentSwitch ) {
            this.refreshMoment( nextProps.filter );
            nextProps.resetRefreshMomentSwitch();
        }
    }

    /**
     * 获取秘圈
    */
    getMomentsFromServer( params = this.state.params, filter = this.props.filter ) {
        if ( this.loading ) {
            return;
        }
        this.loading = true;
        let { pushMoments, showModal } = this.props;
        let { request, cancelRequest } = requestMap[ filter ]( params );
        this.cancelGetMomentsRequest = cancelRequest;
        request.then( ( { moments, collections } ) => {
            moments = moments || collections || [];
            this.loading = false;
            if ( moments.length === 0 ) {
                return this.setState( {//没有更多
                    loadend: true
                } )
            }
            let accounts = getAccountsInMoments( moments );
            checkUsersData( accounts );
            if ( filter === MomentFilters.collection ) {
                moments.forEach( moment => {
                    moment.is_collect = true;
                } );
            }
            pushMoments( filter, moments );
            let lastMoment =  moments.slice( -1 )[ 0 ];
            const lasttime = !!lastMoment ? lastMoment.moment_time : Date.now();
            this.setState( ( preState, props ) => ( {
                params: {
                    page: preState.params.page + 1,
                    uid: preState.params.uid,
                    lasttime,
                }
            } ) );
        } ).catch( e => {
            if ( !e.message && e.__CANCEL__ ) {//取消请求不提示失败
                return;
            }
            showModal( { text: REQUEST_ERROR } );
        } )
    }

    resetState() {
        this.setState( {
            loadend: false,
            params: { ...this.firstParams }
        } )
    }

    /**
     * 刷新秘圈
    */
    refreshMoment = ( filter = this.props.filter ) => {
        if ( this.loading ) {
            !!this.cancelGetMomentsRequest && this.cancelGetMomentsRequest();
            this.loading = false;
        }
        this.resetState();
        this.props.resetMoments( filter );
        this.getMomentsFromServer( this.firstParams, filter );
    };

    /**
     * 加载下一页
    */
    nextPageClickHandler = e => {
        !!e && e.preventDefault();
        this.getMomentsFromServer();
    };

    backToTop = () => {
        document.querySelector('.main').scroll(0, 0);
    }

    /**
     * 秘圈显示区域，包含秘圈的全部操作，外部只需要传递类型然后在FuncMap中添加该类型的对应方法即可
     * filter 秘圈类型
     * showModal 显示通用弹框方法
     * showTransportArea 显示转发弹框方法
     * showReport 显示举报弹框方法
    */
    render() {
        let { filter, showModal, showTransportArea, showReport } = this.props;
        let { loadend, showBachBtn } = this.state;
        let moments = getMoments( filter );
        let loadText = loadend ? "没有更多了..." : <LoadingWithDot text={"正在加载中，请稍候"}/>;
        return (
            <div className={'square-moment-list'} onScroll={this.scrollLoadMore}>
                <div className="square-moment-list">
                    { !moments || moments.length === 0 ? <MomentEmptyPage type={"user"} /> :
                        <Fragment>
                            { !moments ? false : moments.map( ( moment, i ) => <MomentItem showReport={showReport} refresh={this.refreshMoment} showTransportArea={showTransportArea} showModal={showModal} filter={filter} key={ i } data={ moment } /> )}
                        </Fragment>
                    }
                </div>
                { <div className="moment-tip">{ loadText }</div> }
                { showBachBtn ? <button className={'moment-provider-back-top'} onClick={this.backToTop}></button> : false }
            </div>
        );
    }
}

const mapStateToProps = state => ( {
    personlist: state.personlist,
    moments: state.moments,
    userUID: state.userUID
} );

//resetMoments
const mapdispatchToProps = dispatch => ( {
    resetMoments: ( filter ) => dispatch( initMoments( filter, [] ) ),
    pushMoments: ( filter, moments ) => dispatch( addMoments( filter, moments ) )
} );

export default withRouter( connect(
    mapStateToProps,
    mapdispatchToProps
)( MomentProvider ) );
