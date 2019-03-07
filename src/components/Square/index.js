import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import './index.css';
import {withRouter,Switch,Route, Redirect} from "react-router-dom";
import Navi from './Navi';
import FindBack from '../FindBack';
import ChatAnchor from './ChatAnchor';
import UserCenter from './UserCenter';
import MomentProvider, { MomentFilters } from "./MomentProvider";
import MomentPublisher from "./MomentPublisher";
import SegmentedBar from "../generics/SegmentedBar";
import TransportMomentContainer from './TransportMomentContainer';
import UserDataProfile from './UserDataProfile';
import SquareFriendProfile from './SquareFriendProfile';
import { ICON_TAB_ATTENTION_COMMON, ICON_TAB_HOT_ACTIVE, ICON_TAB_HOT_COMMON, ICON_TAB_ATTENTION_ACTIVE, ICON_TAB_WORD_ACTIVE, ICON_TAB_WORD_COMMON } from '../../configs/iconNames'

class Square extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            navBars: [
                {
                    key: MomentFilters.focused,
                    text: "关注",
                    icon: ICON_TAB_ATTENTION_COMMON.convertIconSrc(),
                    selectedIcon: ICON_TAB_ATTENTION_ACTIVE.convertIconSrc(),
                },
                {
                    key: MomentFilters.recommend,
                    text: "世界",
                    icon: ICON_TAB_WORD_COMMON.convertIconSrc(),
                    selectedIcon: ICON_TAB_WORD_ACTIVE.convertIconSrc(),
                },
                {
                    key: MomentFilters.hot,
                    text: "热门",
                    icon: ICON_TAB_HOT_COMMON.convertIconSrc(),
                    selectedIcon: ICON_TAB_HOT_ACTIVE.convertIconSrc(),
                }
            ],
            ifRefreshMoments: false,
            navBarCur: MomentFilters.recommend,
            data: { id: 1 },
            showTransprotArea: false,
            transportParams: null
        };
    }

    componentWillMount () {
        if ( !this.props.token ) {
            this.props.history.push( '/' );
        }
    }

    /**
     * 修改秘圈类型
    */
    changeMomentType = ( type ) => {
        if ( type === this.state.navBarCur ) {
            return;
        } else {
            this.props.history.replace( `/square/${type}` );
            this.setState({navBarCur: type})
        }
    };

    /**
     * 显示转发组件
     * transportParams:
     *     {
     *         mid, // moment id
     *         src, // one image src in moment
     *         text // text profile in moment
     *     }
    */
    showTransportArea = ( transportParams ) => {
        this.setState( {
            showTransprotArea: true,
            transportParams
        } );
    }

    /**
     * 隐藏转发组件
    */
    hideTransportArea = () => {
        this.setState( {
            showTransprotArea: false,
            transportParams: null
        } )
    }

    /**
     * 在其他子组件中刷新moment provider 中的秘圈
    */
    refreshMoments = () => {
        this.setState( {
            ifRefreshMoments: true
        } )
    }

    /**
     * 关闭在其他子组件中刷新moment provider 中的秘圈的开关
    */
    resetRefreshMomentSwitch = () => {
        this.setState( {
            ifRefreshMoments: false
        } )
    }

    /**
     * 广场组件
    */
    render () {
        const filter = MomentFilters.recommend;
        let { showModal, showReport } = this.props;
        let { showTransprotArea, transportParams, navBars, navBarCur, ifRefreshMoments } = this.state;
        return (
            <Fragment>
                <Navi />
                <div className="square-container" id="square">
                    {/* anchor jump to chat */}
                    <ChatAnchor />
                    <Switch>
                        {/* user center */}
                        <Route path="/square/userCenter/:account" render={() => <UserCenter showReport={showReport} showTransportArea={this.showTransportArea} showModal={showModal}/> } />
                        {/* find back mobile phone */}
                        <Route path="/square/findback" render={() => <FindBack showModal={ showModal }/>} />
                        {/* square moments */}
                        <Route path="/square/:filter" render={ ( props ) => (
                            <div className="square-container clear">
                                <div className={'square-moment-container clear'}>
                                    <MomentPublisher showModal={showModal} refreshMoments={this.refreshMoments} />
                                    <SegmentedBar items={navBars}
                                                  cur={navBarCur}
                                                  onCurChange={this.changeMomentType} />
                                    <MomentProvider resetRefreshMomentSwitch={this.resetRefreshMomentSwitch} refreshMomentSwitch={ifRefreshMoments} showReport={showReport}  showTransportArea={this.showTransportArea} showModal={showModal} filter={props.match.params.filter} />
                                </div>
                                <UserDataProfile showModal={showModal}/>
                                <SquareFriendProfile/>
                            </div>
                        ) } />
                        <Redirect from="/square" to={`/square/${MomentFilters.recommend}`} />
                    </Switch>
                    { showTransprotArea ? <TransportMomentContainer showModal={showModal} params={transportParams} hideTransportArea={this.hideTransportArea}/> : false }
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps( state ) {
    return {
        token: state.serverToken
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        // setFocusedUsers2: ( userUID, users, focuedUsersPage ) => dispatch( setFocusedUsers( userUID, users, focuedUsersPage ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( Square ) );