import React, { Component } from 'react';
import {connect} from "react-redux";
import { Link,withRouter } from 'react-router-dom';
import {setCurrentSessionId} from "../../../../../redux/actions/index";
import './index.css';
import {CHATTING_HISTORY, P2P, SESSION_MENU, TEAM} from "../../../../../configs/consts";
import {
    getMsgProfileByLastMsg,
    getSceneAndAccountBySID,
    getUserData,
    resetForm,
    transTime2
} from "../../../../../util";
import {getDefaultTeamAvatar, getMtsdk, getPersonById, getTeamAvatar, getTeamById} from "../../../../../redux/store/storeBridge";
import Avatar from '../../../../generics/Avatar';
import UnreadTip from './UnreadTip';
import DateTip from './DateTip';
import {checkTeamMemberUserData, checkUsersData} from "../../../../../util/user";
import {offSwitch} from "../../../../../redux/actions";
import {IMBridge} from "../../../../../SDK/IMBridge";

class SessionItem extends Component {
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
    }

    /**
     * 同步会话涉及对象的数据
    */
    checkUserData( sid ) {
        let { scene, account: id } = getSceneAndAccountBySID( sid );
        if ( scene === TEAM ) {
            checkTeamMemberUserData( id );
        } else {
            checkUsersData( [ id ] );
        }
    }

    /**
     * session item 点击处理方法
     * 设置currentSessionId,重置会话消息未读数，清空搜索关键字，切换会话面板
     * 关闭会话菜单，清空文件输入框，同步该用户数据
    */
    clickHandler ( e ) {
        let { id } = this.props.data,
            mtsdk = getMtsdk(),
            curId = this.props.currentSessionId;
        this.checkUserData( id );
        mtsdk.resetSessionUnread( id );
        if ( id === curId ) {
            return;
        }
        this.props.resetSearchWords();
        resetForm( this.props.fileId );
        this.props.history.replace( `/chat/session/${id}` );
        this.props.setCurrentSessionId( id );
        let { scene, account } = getSceneAndAccountBySID( id )
        IMBridge.setCurrSession( { scene, to: account } );
        this.props.offMenuSwitch();
        // this.props.hideHistory( id );
        e.preventDefault();
    }

    /**
     * 获取渲染session list item 用数据
    */
    getData( data ) {
        let { id, lastMsg } = data,
            arr = id.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        if ( scene === P2P ) {
            return this.getDataOfUser( account, lastMsg );
        } else if ( scene === TEAM ) {
            return this.getDataOfTeam( account, lastMsg );
        } else {
            return {};
        }
    }

    /**
     * 获取好友会话的item数据
     * @return {Object}
     *     {
     *         text: {String} 根据最近的一条消息获取的展示文本
     *         avatar: {String} 好友头像
     *         name: {String} 好友昵称
     *         time: {String} 最近一次发送消息时间
     *     }
    */
    getDataOfUser( account, lastMsg ) {
        let { avatar, alias: name } = getUserData( getPersonById( account ) );
        return {
            text: getMsgProfileByLastMsg( lastMsg ),
            avatar,
            name,
            time: !!lastMsg ? transTime2( lastMsg.time ) : ""
        }
    }

    /**
     * 获取群组会话的item数据
     * @return {Object}
     *     {
     *         text: {String} 根据最近的一条消息获取的展示文本
     *         avatar: {String} 群组头像
     *         name: {String} 群名
     *         time: {String} 最近一次发送消息时间
     *     }
    */
    getDataOfTeam( account, lastMsg ) {
        let { name } = getTeamById( account );
        let avatar = getTeamAvatar( account );
        return {
            text: getMsgProfileByLastMsg( lastMsg ),
            avatar,
            name,
            time: !!lastMsg ? transTime2( lastMsg.time ) : ""
        }
    }

    /**
     * 会话item组件
     * data: {Object} 会话数据
     *     {
     *         id: {String} session id
     *         unread: {Number} 会话未读数
     *     }
     * currentSessionId： {String} 当前选中的会话id
    */
    render () {
        let { id, unread } = this.props.data;
        let { avatar, name, text, time } = this.getData( this.props.data );
        unread = unread > 99 ? "99+" : unread;
        let curSId = this.props.currentSessionId;
        return (
            <div className={ "chat-tab-item session-item" + ( id === curSId ? " session-item-cur" : "" ) } onClick={this.clickHandler}>
                <Avatar classes={['tab-item-avatar']} src={avatar} />
                <div className="auto-omit chat-session-alias">{ name }</div>
                <div className="auto-omit chat-session-text">{ text }</div>
                { unread == 0 ? false : <UnreadTip num={unread} /> }
                <DateTip date={time} />
            </div> )


    }
}
const mapStateToProps = ( state ) => {
  return {
      personlist: state.personlist,
      friendlist: state.friendlist,
      teamMap: state.teamMap,
      teamMembers: state.teamMembers,
      currentSessionId: state.currentSessionId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setCurrentSessionId: ( sessionId ) => dispatch( setCurrentSessionId( sessionId ) ),
      offMenuSwitch: () => dispatch( offSwitch( SESSION_MENU ) ),
      // hideHistory: ( sid ) => dispatch( offSwitch( CHATTING_HISTORY, { sid } ) )
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( SessionItem ));
