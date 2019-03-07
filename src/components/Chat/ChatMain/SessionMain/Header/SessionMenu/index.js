import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {CHATTING_HISTORY, P2P, SESSION_MENU, MODAL_ALERT, MODAL_PROMPT, HISTORY_REPALCE, INPUT_PASSWORD, MODAL_CONFIRM, TEAM, MSGIDS} from "../../../../../../configs/consts";
import {onSwitch, toggleSwitchs} from "../../../../../../redux/actions";
import MenuItem from "./MenuItem";
import {getPersonById, getTeamById, isFriend, isTeamManager} from "../../../../../../redux/store/storeBridge";
import { ICON_NEWS_DELETE, ICON_NEWS_CHATS, ICON_NEWS_EDIT, ICON_NEWS_NOTICE } from '../../../../../../configs/iconNames'
import {sendCheckCHPasswordRequest, sendDeleteFriendRequest, sendDismissTeamRequest, sendLeaveTeamRequest} from "../../../../../../requests";
import {getSceneAndAccountBySID, getUserData} from "../../../../../../util";
import ChatMenuHeader from '../../../../../generics/ChatMenuHeader';
import {DATA_ERROR, DELETE_FRIEND_ERROR, DELETE_FRIEND_SUCCESS, DISMISS_TEAM_ERROR, DISMISS_TEAM_SUCCESS, QUIT_TEAM_ERROR, QUIT_TEAM_SUCCESS, REQUEST_ERROR, RETRY_LATER} from "../../../../../../configs/TIP_TEXTS";

const i_edit = ICON_NEWS_EDIT.convertIconSrc();
const i_delete = ICON_NEWS_DELETE.convertIconSrc();
const i_chats = ICON_NEWS_CHATS.convertIconSrc();
const i_notice = ICON_NEWS_NOTICE.convertIconSrc();

class SessionMenu extends Component {
    constructor( props ) {
        super( props );
        this.showDeleteFriendVerify = this.showDeleteFriendVerify.bind( this );
        this.deleteFriend = this.deleteFriend.bind( this );
        this.showQuitTeamVerify = this.showQuitTeamVerify.bind( this );
        this.showDismissTeamVerify = this.showDismissTeamVerify.bind( this );
        this.showChattingHistoryPasswordModal = this.showChattingHistoryPasswordModal.bind( this );
        this.showChattingHistory = this.showChattingHistory.bind( this );
        this.menuDatas = [
            { text: "修改备注", icon: i_edit, clickHandler: "" },
            { text: "修改群名", icon: i_edit, clickHandler: "" },
            { text: "聊天记录", icon: i_chats, clickHandler: this.showChattingHistoryPasswordModal },
            { text: "删除好友", icon: i_delete, clickHandler: this.showDeleteFriendVerify },
            { text: "退出群聊", icon: i_delete, clickHandler: this.showQuitTeamVerify },
            { text: "解散群组", icon: i_delete, clickHandler: this.showDismissTeamVerify },
        ];

    }

    /**
     * 显示输入聊天记录密码（现使用登录密码）弹框
    */
    showChattingHistoryPasswordModal( changeHistoryType ) {
        let { showModal, location } = this.props;
        showModal({ type: MODAL_PROMPT, text: "请输入密码", inputType: INPUT_PASSWORD, callback: this.showChattingHistory, cancelCallback: undefined, curLocation: location, changeHistoryType, autoReplace: false })
    }

    /**
     * 显示聊天记录
    */
    showChattingHistory( password ) {
        sendCheckCHPasswordRequest( password ).then( ( { msgId, pass } ) => {
            let { showModal, location, history } = this.props;
            if ( !!pass ) {
                this.props.showHistory( this.props.sid );
                history.replace( location );
            } else {
                showModal( { text: "密码错误", curLocation: location, callback: this.showChattingHistoryPasswordModal.bind( null, HISTORY_REPALCE ), changeHistoryType: HISTORY_REPALCE, autoReplace: false } );
            }
        } ).catch( e => {
            console.log( e );
            let { showModal, location, history } = this.props;
            showModal( { text: REQUEST_ERROR, curLocation: location, callback: this.showChattingHistoryPasswordModal.bind( null, HISTORY_REPALCE ), changeHistoryType: HISTORY_REPALCE, autoReplace: false } );
        } )
    }

    /**
     * 删除好友
    */
    deleteFriend( account ) {
        let { showModal, location, history } = this.props;
        sendDeleteFriendRequest( account ).then( ( { msgId } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: DELETE_FRIEND_SUCCESS } );
            } else {
                showModal( { text: DELETE_FRIEND_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( {text: REQUEST_ERROR } );
        } );
    }

    /**
     * 退群
    */
    quitTeam( account ) {
        let { showModal } = this.props;
        sendLeaveTeamRequest( account ).then( ( { msgId } ) => {
            if( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: QUIT_TEAM_SUCCESS } );
            } else {
                showModal( { text: QUIT_TEAM_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } )
        } )
    }

    /**
     * 解散群
    */
    dismissTeam( account ) {
        let { showModal } = this.props;
        sendDismissTeamRequest( account ).then( ( { msgId } ) => {
            if( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: DISMISS_TEAM_SUCCESS } );
            } else {
                showModal( { text: DISMISS_TEAM_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } )
        } )
    }

    /**
     * 显示删除好友确认弹框
    */
    showDeleteFriendVerify() {
        let { sid, showModal } = this.props,
            { scene, account } = getSceneAndAccountBySID( sid );
        if ( scene !== P2P ) {
            showModal( {text: DATA_ERROR + RETRY_LATER } );
            return;
        }
        let { alias } = getUserData( getPersonById( account ) );
        showModal( { type: MODAL_CONFIRM, text: `确认删除${alias}吗？`, callback: this.deleteFriend.bind( this, account ) } );
    }

    /**
     * 显示退群确认弹框
    */
    showQuitTeamVerify() {
        let { sid, showModal } = this.props,
            { scene, account } = getSceneAndAccountBySID( sid );
        if ( scene !== TEAM ) {
            showModal( {text: DATA_ERROR + RETRY_LATER } );
            return;
        }
        let { name } = getTeamById( account );
        showModal( { type: MODAL_CONFIRM, text: `确认退出${name}吗？`, callback: this.quitTeam.bind( this, account ) } );
    }

    /**
     * 显示解散群确认弹框
    */
    showDismissTeamVerify() {
        let { sid, showModal } = this.props,
            { scene, account } = getSceneAndAccountBySID( sid );
        if ( scene !== TEAM ) {
            showModal( {text: DATA_ERROR + RETRY_LATER } );
            return;
        }
        let { name } = getTeamById( account );
        showModal( { type: MODAL_CONFIRM, text: `确认解散${name}吗？`, callback: this.dismissTeam.bind( this, account ) } );
    }

    /**
     * 根据sessionId获取菜单应该显示的选项
    */
    getMenuData( sid ) {
        if ( !sid ) {
            return []
        }
        let res = [],
            arr = sid.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        //删除修改昵称以及群名功能
        if ( scene === P2P ) {
            // res.push( this.menuDatas[ 0 ] )
            res.push( this.menuDatas[ 2 ] );
            isFriend( account ) && res.push( this.menuDatas[ 3 ] );
        } else {
            // res.push( this.menuDatas[ 1 ] )
            res.push( this.menuDatas[ 2 ] );
            isTeamManager( account ) && res.push( this.menuDatas[ 5 ] ) || res.push( this.menuDatas[ 4 ] );
        }
        // res[0].clickHandler = this.props.showEditArea;
        return res;
    }

    /**
     * 会话菜单组件
     * sid: session id
    */
    render () {
        let { menuSwitch: on, sid } = this.props;
        let menuData = this.getMenuData( sid );
        return (
            <div className={'session-menu-container clear'}>
                <div className={"menu-icon"}></div>
                <div className={"menu-list clear"}>
                    <ChatMenuHeader width={120}/>
                    <div className="ml-text-area shadow clear">{
                        menuData.map( ( v, i ) => {
                            return <MenuItem data={v} key={i} />
                        } )
                    }</div>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        menuSwitch: state.switchs[SESSION_MENU]
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        toggleMenuSwitch: () => dispatch( toggleSwitchs( SESSION_MENU ) ),
        showHistory: ( sid ) => dispatch( onSwitch( CHATTING_HISTORY, { sid } ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( SessionMenu ) );
