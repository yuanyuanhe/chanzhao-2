import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import Avatar from "../../generics/Avatar";
import {checkJSON, getRepostParams, getUserData, transTime2} from "../../../util";
import {getPersonById, getUserUID} from "../../../redux/store/storeBridge";
import MomentWord from './MomentWord';
import MomentImages from './MomentImages';
import MomentImage from './MomentImage';
import MomentVideo from './MomentVideo';
import MomentTopic from './MomentTopic';
import MomentLabel from './MomentLabel';
import MomentIcon from './MomentIcon';
import MomentArticle from './MomentArticle';
import MomentGameShare from './MomentGameShare';
import MomentTransport from "./MomentTransport";
import MomentDeleteContent from "./MomentDeleteContent";
import CommentArea from './CommentArea';
import MomentHeader from './MomentHeader';
import MomentIdentityCard from './MomentIdentityCard';
import {sendCancelThumbUpMomentRequest, sendThumbUpMomentRequest} from "../../../requests";
import {cancelUpMomentInProvider, upMomentInProvider} from "../../../redux/actions";
import { ICON_CIRCLE_SHARE, ICON_CIECLE_COMMENT, ICON_CIRCLE_LIKE_ACTIVE, ICON_CIRCLE_LIKE_COMMON } from '../../../configs/iconNames';
import {MomentFilters} from "../MomentProvider";
import {CANCEL_THUMB_UP_FAIL, ORIGIN_MOMENT_DELETED, REQUEST_ERROR, RETRY_LATER, THUMB_UP_FAIL} from "../../../configs/TIP_TEXTS";


/* TODO: 提取出专门的 container
 * 作为映射 store 到展示组件 props 的 adapter
 * 同时展示组件内容大部分相同, 只有渲染资源内容不同 (图片, 视频, 链接等)
 * 不需要现在这么多分类
 */

class MomentItem extends Component{
    constructor( props ) {
        super( props );
        this.icons = [];
        this.commentClickHandler = this.commentClickHandler.bind( this );
        this.starClickHandler = this.starClickHandler.bind( this );
        this.repostClickHandler = this.repostClickHandler.bind( this );
        this.state = {
            showComment: false
        }
        this.staring = false;
    }

    /**
     * 渲染资源（图片、视频）部分
     * type： moment type
     * resource: res_json JSON.parse后的数据
    */
    getResPart( type, resource ) {
        if ( type != 2 && type != 3 ) {
            return false;
        }
        switch ( parseInt( type ) ) {
            case 2:
                if ( resource.length === 1 ) {
                    return <MomentImage src={resource[0]} />
                } else if ( resource.length > 1 ) {
                    return <MomentImages srcs={resource}/>
                } else {
                    return false;
                }
            case 3:
                return <MomentVideo data={resource} />;
            default:
                return false;
        }
    }

    /**
     * 获取文章秘圈
    */
    getArticle( type, res_json ) {
        return type == 4 ? <MomentArticle data={ res_json } /> : false;
    }

    /**
     * 获取游戏分享秘圈
     * 现在已经和文章秘圈合并，但是老数据要兼容
    */
    getGameShare( type, res_json ) {
        return type == 6 ? <MomentGameShare data={res_json}/> : false;
    }

    /**
     * 获取名片秘圈
    */
    getIdentityCard( type, res_json ) {
        return type == 7 ? <MomentIdentityCard data={res_json}/> : false;
    }

    /**
     * 获取文字部分
    */
    getWord( words ) {
        return !!words ? <MomentWord words={words}/> : false;
    }

    /**
     * 获取话题部分
    */
    getTopic( topic ) {
        return !!topic ? <MomentTopic text={topic} /> : false;
    }

    /**
     * 获取标签部分
    */
    getLabels( labels ) {
        if ( !Array.isArray( labels ) || labels.length === 0 ) {
            return false;
        }
        return <div className="moment-label-list bw">
            { labels.map( ( v, i ) => (
                <MomentLabel text={v} key={i}/>
            ) ) }
        </div>

    }

    /**
     * 获取秘圈菜单栏，点赞评论收藏
    */
    getIcons( { comment_number, is_thumbsup, thumbsup_number, allow_repost } ) {
        let icons = [];
        if ( typeof thumbsup_number !== "undefined" ) {
            let userUID = getUserUID();
            icons.push( {
                data: {
                    num:thumbsup_number,
                    text: "点赞",
                    cur: is_thumbsup,
                    src: ICON_CIRCLE_LIKE_COMMON.convertIconSrc(),
                    curSrc: ICON_CIRCLE_LIKE_ACTIVE.convertIconSrc()
                },
                callback: this.starClickHandler
            } );
        }
        if ( typeof comment_number !== "undefined" ) {
            icons.push( {
                data: {
                    num: comment_number,
                    text: "评论",
                    src: ICON_CIECLE_COMMENT.convertIconSrc()
                },
                callback: this.commentClickHandler
            } );
        }
        if ( allow_repost != 0 ) {
            icons.push( {
                data: {
                    text: "转发",
                    src: ICON_CIRCLE_SHARE.convertIconSrc()
                },
                callback: this.repostClickHandler
            } );
        }
        return icons.map( v => (
            <MomentIcon key={v.data.text} data={v.data} callback={v.callback} />
        ) )
    }

    /**
     * 获取秘圈body部分，文字图片视频文章等
    */
    getMain( { words, type, res_json, isDel } ) {
        if ( isDel == 0 ) {
            return <div className="moment-item-main-layout">
                { this.getWord( words ) }
                { this.getResPart( type, res_json ) }
                { this.getArticle( type, res_json ) }
                { this.getGameShare( type,res_json ) }
                { this.getIdentityCard( type,res_json ) }
                </div>
        } else {
            return <div className="moment-item-main-layout">
                <MomentDeleteContent/>
            </div>
        }
    }

    /**
     * 评论icon点击回调 单纯显示评论区域
    */
    commentClickHandler() {
        this.setState( {
            showComment: !this.state.showComment
        } );
    }
    /**
     * 秘圈菜单栏（转发评论点赞）中点赞icon的点击回调
     * cur: 是否已经点赞过该说说，点赞过就取消点赞，没点赞就调用点赞请求
     * upMoment： 更新（点赞）redux中的秘圈数据，点赞后不刷新momentProvider
     * cancelUpMoment: 更新（取消点赞）redux中的秘圈数据，取消点赞后不刷新momentProvider
    */
    starClickHandler( cur ) {
        if ( this.staring ) {
            return;
        }
        this.staring = true;
        let { data: { mid }, showModal, filter, upMoment, cancelUpMoment } = this.props;
        if ( !cur ) {
            sendThumbUpMomentRequest( mid ).then( ( { msgId } ) =>{
                if ( msgId === '200' ) {
                    upMoment( mid, filter );
                } else {
                    showModal( { text: THUMB_UP_FAIL + RETRY_LATER } );
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.staring = false;
            } );
        } else {
            sendCancelThumbUpMomentRequest( mid ).then( ( { msgId } ) =>{
                if ( msgId === '200' ) {
                    cancelUpMoment( mid, filter );
                } else {
                    showModal( { text: CANCEL_THUMB_UP_FAIL + RETRY_LATER } );
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.staring = false;
            } );
        }
    }

    /**
     * 秘圈菜单栏（转发评论点赞）中转发icon的点击回调
     * showTransportArea： 显示转发秘圈的弹框
     * refresh： 刷新整个momentProvider的方法
     * showModal： 显示弹框
    */
    repostClickHandler() {
        let { refresh, showTransportArea, showModal, data: { mid, res_json, type, words } } = this.props;
        let params = getRepostParams( { mid, type, words, res_json } );
        if ( !params ) {
            showModal( { text: ORIGIN_MOMENT_DELETED } );
            return;
        }
        params.callback = refresh;
        !!showTransportArea && showTransportArea( params );
    }

    /**
     * 获取秘圈header部分，转发说说不显示菜单部分
     * isDel： 秘圈是否已被删除，已被删除返回false
     * showMenu： 是否显示菜单部分
     * showModal：弹框通用方法
     * avatarClasses： 定制头像样式的css类名数组
     * uid： 用户account,
     * transportedMid: 被转发说说的mid,
     * filter： 秘圈的种类（世界，推荐等）,
     * mid：秘圈mid,
     * isTransport： 是否是转发说说,
     * before_time： 秘圈发布时间,直接显示的字符串
     * is_collect：是否已被收藏,
     * is_follower： 自己是否已关注发布者
    */
    getHeader( { isDel, showMenu, showModal, avatarClasses, uid, transportedMid, filter, mid, isTransport, before_time, is_collect,is_follower } ) {
        if ( !!isDel ) {
            return false;
        }
        let { showReport } = this.props;
        return <MomentHeader showReport={showReport} showMenu={showMenu} showModal={showModal} avatarClasses={avatarClasses} uid={uid} isCollect={is_collect} transportedMid={transportedMid} filter={filter} mid={mid} isTransport={isTransport} time={before_time} isFollower={is_follower}/>
    }

    /**
     * 秘圈组件
     * data: //秘圈数据，后端返回的秘圈类型
     * {
     *     type: 类型,
     *     words： 文本,
     *     res_json： 包含资源类信息以及转发说说的说说主体,
     *     name： 用户名,
     *     uid： 用户account,
     *     mid: 秘圈id,
     *     before_time: 秘圈发布时间，可以直接显示（“n小时前”这种的）,
     *     moment_time： 秘圈发布时间戳13位,
     *     topic： 话题,
     *     labels： 标签数组,
     *     comment_number： 评论数,
     *     thumbsup_number： 点赞数,
     *     is_thumbsup： 是否已经点赞,
     *     allow_repost： 是否允许转发,
     *     is_follower： 自己是否已经关注发布用户,
     *     is_collect： 是否已经收藏此说说，如果是转发说说则表示是否已经收藏原说说
     * }
     * filter： 秘圈类型
     * showModal： 弹框通用方法
    */
    render () {
        let resource,
            realType,
            num = 0;
        let { data: {
            type, words, res_json, name, uid, mid,
            before_time, moment_time, topic, labels, comment_number, thumbsup_number, is_thumbsup, allow_repost, is_follower, is_collect
        } } = this.props;
        let { filter, showModal, data } = this.props;
        let { showComment } = this.state;
        let transportedMid;
        let isDel = 0,
            tUid,
            tTime,
            isTransport: false,
            tWords = words,
            tType = type;
        if ( type == 5 ) {
            let data = checkJSON( res_json ) || {};
            res_json = data.res_json;
            tType = data.type;
            tWords = data.words;
            isDel = data.is_del;
            transportedMid = data.mid;
            isTransport = true;
            tUid = data.uid;
            tTime = data.before_time || transTime2(data.moment_time);
        }
        res_json = checkJSON( res_json ) || {};

        let { avatar = ( data.avatar || "https://devcdn.mitures.com/headings/default/2.jpg" ), alias= ( data.name || "unnamed" ) } = getUserData( getPersonById( uid ) );
        let main = this.getMain( { isDel, words: tWords, type: tType, res_json } );
        let avatarClasses = [ 'moment-avatar', 'moment-avatar-out' ]
        if ( type == 5 ) {
            main = (
                <div className="moment-item-main-layout">
                    {this.getWord( words )}
                    <MomentTransport>
                        { this.getHeader( { isDel, showMenu: false, showModal, avatarClasses, uid: tUid, transportedMid, filter, mid, isTransport, before_time: tTime, is_follower, is_collect} ) }
                        {main}
                    </MomentTransport>
                </div>)
        }

        return (
            <div className={"moment-item-container clear shadow"}>
                <div className="moment-item">
                    { this.getHeader( { showMenu: true, showModal, avatarClasses, uid, transportedMid, filter, mid, before_time, is_follower, is_collect } ) }
                    { main }
                    <div className="topic-line clear">
                        { this.getTopic( topic ) }
                        { this.getLabels( labels ) }
                    </div>
                    { filter === MomentFilters.collection ? false : <div className="moment-icon-container">
                        { this.getIcons( { comment_number, is_thumbsup, thumbsup_number, allow_repost, mid} ) }
                    </div>}
                    <CommentArea showModal={showModal} show={showComment} filter={filter} mid={mid} account={uid} />
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( dispatch ) {
    return {
        cancelUpMoment: ( mid, momentType ) => dispatch( cancelUpMomentInProvider( mid, momentType ) ),
        upMoment: ( mid, momentType ) => dispatch( upMomentInProvider( mid, momentType ) ),
    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( MomentItem );
