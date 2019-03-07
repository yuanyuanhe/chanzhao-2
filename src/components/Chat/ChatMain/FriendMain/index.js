import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getMtsdk, getPersonById, getSessions, getUserUID,getFriendAlias} from "../../../../redux/store/storeBridge";
import {getUserData, startChatWith} from "../../../../util";
import {setCurrentSessionId, setFriendTabId, setSessionList, updateFriendAlias} from "../../../../redux/actions";
import {store} from "../../../../redux/store";
import {sendChangeFriendsRemarkRequest, sendDeleteFriendRequest} from "../../../../requests";
import Avatar from '../../../generics/Avatar';
import MainAnchor from '../MainAnchor';
import { ICON_NEWFRIEND_CIRCLE,ICON_NEWFRIEND_TALK } from '../../../../configs/iconNames';
import {MSGIDS, SEX_MALE} from "../../../../configs/consts";
import SamePart from '../SamePart';
import { IMUtil } from "../../../../SDK/IMUtil";
import {createFakeSession} from "../../../../util/session";
import {DELETE_FRIEND_ERROR, DELETE_FRIEND_SUCCESS, RETRY_LATER} from "../../../../configs/TIP_TEXTS";


const squareIcon = ICON_NEWFRIEND_CIRCLE.convertIconSrc();
const talkIcon = ICON_NEWFRIEND_TALK.convertIconSrc();
const maleSex = SEX_MALE;

class FriendMain extends Component{
    constructor( props ) {
        super( props );
        this.startChat = this.startChat.bind( this );
        this.deleteFriend = this.deleteFriend.bind( this );
        this.showDeleteFriendVerify = this.showDeleteFriendVerify.bind( this );
        this.aliasBlurHandler = this.aliasBlurHandler.bind( this );

        this.profiles = [
            {
                key: 'alias',
                value: "",
                text: "备注",
                blurHandler: this.aliasBlurHandler
            },{
                key: "age",
                value: "",
                text: "年龄"
            }, {
                key: "area",
                value: "",
                text: "地区"
            }, {
                key: "mt_number",
                value: "",
                text: "秘图号"
            }
        ]
        this.startChat = this.startChat.bind( this );
        this.jumpToUserCenter = this.jumpToUserCenter.bind( this );
    }

    /**
     * 修改昵称 blur handler
     * 功能被删 方法保留
    */
    aliasBlurHandler( e ) {
        let value = e.target.value;
        if ( value === this.profiles[0].value ) {
            return;
        }
        let { account } = this.props.match.params;
        this.changeAlias( account, value ).then( res => {
            if ( !res && typeof res === 'boolean') {
                return false;
            }
        } )
    }

    /**
     * 修改昵称
     * 功能被删 方法保留
    */
    changeAlias( account, value ) {
        return sendChangeFriendsRemarkRequest( account, value ).then( ({msgId}) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                getFriendAlias( account ) === value ? false : store.dispatch( updateFriendAlias( account, value ) );
                return { value, account }
            } else {
                return false;
            }
        } )
    }

    getProfiles( account ) {
        let userUID = getUserUID();
        if ( account == userUID ) {
            return [];
        }
        let profiles = this.profiles,
            data = getUserData( getPersonById( account ) );
        profiles.forEach( v => {
            v.value = data[v.key]
        } );
        return profiles;
    }

    jumpToUserCenter() {
        let { account } = this.props.match.params;
        this.props.history.push( `/square/userCenter/${account}/users/focus` );
    }

    /**
     * 显示删除好友确认弹框
    */
    showDeleteFriendVerify()  {
        let { account } = this.props.match.params;
        let { alias } = getUserData( getPersonById( account ) );
        this.props.showModal( {
            type: "confirm",
            text: "确认删除" + alias + "吗？",
            callback: this.deleteFriend } );
    }

    deleteFriend() {
        let { account } = this.props.match.params;
        let { cleanFriendTabId, history, showModal } = this.props;
        sendDeleteFriendRequest( account ).then( ( { msgId } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                history.replace( '/chat/friend' );
                cleanFriendTabId();
                showModal( { text: DELETE_FRIEND_SUCCESS } );
            } else {
                console.log( "delete error" );
                showModal( { text: DELETE_FRIEND_ERROR + RETRY_LATER } );
            }
        } )
    }

    startChat() {
        let { history, match: { params: { account } } } = this.props;
        startChatWith( account, history );
    }

    getAnchors() {
        let { account } = this.props.match.params;
        return [
            {
                src: squareIcon,
                clickHandler: this.jumpToUserCenter
            },{
                src: talkIcon,
                clickHandler: this.startChat
            }
        ]
    }

    /**
     * 好友详情主面板
     * 复用SamePart组件
    */
    render () {
        let anchors = this.getAnchors(),
            userUID = getUserUID(),
            { account } = this.props.match.params,
            { name, alias, avatar, sex, autograph } = getUserData( getPersonById( account ) ),
            profiles = this.getProfiles( account );
        return (
            <div className={"chat-friend-main"}>
                <SamePart name={name} avatar={avatar} deleteHandler={account == userUID ? false : this.showDeleteFriendVerify} sex={sex} anchors={anchors} autograph={autograph} profiles={profiles} >
                    <div className="split-line"></div>
                </SamePart>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        friends: state.friendlist,
        personlist: state.personlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        setCurrentSessionId: ( sessionId ) => dispatch( setCurrentSessionId( sessionId ) ),
        cleanFriendTabId: () => dispatch( setFriendTabId( "" ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( FriendMain ) );
