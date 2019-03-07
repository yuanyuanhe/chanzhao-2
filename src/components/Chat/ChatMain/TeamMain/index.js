import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getDefaultTeamAvatar, getMtsdk, getPersonById, getSessions, getTeamById, getTeamMembers, getUserUID, getNickInTeam, isTeamManager, getTeamAvatar} from "../../../../redux/store/storeBridge";
import {store} from "../../../../redux/store";
import {setCurrentSessionId, setSessionList, setTeamMembers, setTeamTabId, toggleSwitchs} from "../../../../redux/actions";
import {teamMembers} from "../../../../redux/reducers/teamMembers";
import SamePart from '../SamePart';
import {ICON_NEWFRIEND_TALK} from "../../../../configs/iconNames";
import {getSceneAndAccountBySID, getUserData, startChatWith} from "../../../../util";
import ProfileItem from '../ProfileItem';
import MemberList from '../MemberList';
import {MEMBER_LSIT, MODAL_CONFIRM, MSGIDS, TEAM} from "../../../../configs/consts";
import {switchs} from "../../../../redux/reducers/switchs";
import {sendDismissTeamRequest, sendLeaveTeamRequest} from "../../../../requests";
import { IMUtil } from "../../../../SDK/IMUtil";
import {createSession} from "../../../../util/session";
import {DISMISS_TEAM_ERROR, DISMISS_TEAM_SUCCESS, QUIT_TEAM_ERROR, QUIT_TEAM_SUCCESS, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";

const talkIcon = ICON_NEWFRIEND_TALK.convertIconSrc();
const defaultAvatar = getDefaultTeamAvatar();
const addressBookTeamDefaultURL = '/chat/team';
class TeamMain extends Component{
    constructor( props ) {
        super( props );
        this.startChat = this.startChat.bind( this );
        this.showMembers = this.showMembers.bind( this );
        this.dismissTeam = this.dismissTeam.bind( this );
        this.nameBlurHandler = this.nameBlurHandler.bind( this );
        this.nickInTeamBlurHandler = this.nickInTeamBlurHandler.bind( this );
        this.toggleMemberlist = this.toggleMemberlist.bind( this );
        this.showDeleteTeamVerify = this.showDeleteTeamVerify.bind( this );
        this.changeCur = this.changeCur.bind( this );
        this.profiles = [
            {
                key: 'name',
                value: "",
                text: "群名",
                blurHandler: this.nameBlurHandler
            }, {
                key: "teamId",
                value: "",
                text: "帐号"
            }
        ];
        this.nickProfile = {
            key: 'nickInTeam',
            value: "",
            text: "群内昵称",
            blurHandler: this.nickInTeamBlurHandler
        }
        this.state = {
            showMembers: false,
            cur: ""
        }
    }

    /**
     * 显示/隐藏群成员列表
    */
    toggleMemberlist() {
        this.setState( {
            showMembers: !this.state.showMembers,
            cur: ""
        } )
    }

    /**
     * 群成员列表 修改被选中的群成员
    */
    changeCur( account ) {
        let cur = this.state.cur == account ? undefined : account;
        this.setState( {
            cur
        } );
    }

    /**
     * 群成员列表 清空被选中的群成员
    */
    cleanCur = () => {
        this.setState( {
            cur: ""
        } );
    }

    /**
     * 修改群名方法
     * 功能被删 方法保留
    */
    nameBlurHandler( e ) {
        let value = e.target.value;
        if ( value === this.profiles[0].value ) {
            return;
        }
        let { teamId } = this.props.match.params;
        this.changeTeamName( teamId, value ).then( res => {
            if ( !res && typeof res === 'boolean') {
                return false;
            }
            console.log( res );
        } )
    }

    /**
     * 修改群内昵称方法
     * 功能被删 方法保留
    */
    nickInTeamBlurHandler( e ) {
        let nickInTeam = e.target.value;
        if ( nickInTeam === this.nickProfile.value ) {
            return;
        }
        let userUID = getUserUID(),
            { teamId } = this.props.match.params;
        let mtsdk = getMtsdk();
        mtsdk.updateInfoInTeam( { teamId,nickInTeam } ).then( res => {
            console.log( res )
        } ).catch( e => {
            console.log( e );
        } )
    }

    getProfiles( teamId ) {
        let profiles = this.profiles,
            data = getTeamById( teamId );
        profiles.forEach( v => {
            v.value = data[v.key]
        } );
        return profiles;
    }

    /**
     * 获取用户在群内的昵称
    */
    getNickProfile( teamId ) {
        let userUID = getUserUID(),
            { name } = getUserData( getPersonById( userUID ) );
        let nickInTeam = getNickInTeam( userUID, teamId ) || name;
        this.nickProfile.value = nickInTeam;
        return this.nickProfile;
    }

    /**
     * 修改群名
    */
    changeTeamName( teamId, name ) {
        let mtsdk = getMtsdk();
        console.log( teamId, name );
        return mtsdk.updateTeam( { teamId, name } ).then( res => {
            console.log( res );
            return res;
        } ).catch( e => {
            console.log( e )
            return e;
        } );
    }

    /**
     * 显示退出/解散群组确认弹框
    */
    showDeleteTeamVerify() {
        let { match: { params: { teamId } }, showModal } = this.props;
        let { name } = getTeamById( teamId ),
            callback,
            text;
        if ( isTeamManager( teamId ) ) {
            text = `确认解散${name}吗？`;
            callback = this.dismissTeam.bind( this, teamId );
        } else {
            text = `确认退出${name}吗？`;
            callback = this.quitTeam.bind( this, teamId );
        }
        showModal( { type: MODAL_CONFIRM, text, callback } );
    }

    /**
     * 非群主退群，只是退群
    */
    quitTeam( account ) {
        let { showModal, history, cleamTID } = this.props;
        sendLeaveTeamRequest( account ).then( ( { msgId } ) => {
            if( msgId === MSGIDS.SUCCESS ) {
                history.replace( addressBookTeamDefaultURL );
                showModal( { text: QUIT_TEAM_SUCCESS } );
                cleamTID();
            } else {
                showModal( { text: QUIT_TEAM_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } )
        } )
    }

    /**
     * 解散群： 如果群主选择退群则解散该群
    */
    dismissTeam( account ) {
        let { showModal, history, cleamTID } = this.props;
        sendDismissTeamRequest( account ).then( ( { msgId } ) => {
            if( msgId === MSGIDS.SUCCESS ) {
                history.replace( addressBookTeamDefaultURL );
                showModal( { text: DISMISS_TEAM_SUCCESS } );
                cleamTID();
            } else {
                showModal( { text: DISMISS_TEAM_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } )
        } )
    }

    /**
     * 开始聊天
     * 已存在会话则跳转，不存在会话则创建新会话并跳转
     * SDK bug： 存在部分不在sessions数组里但是创建会话时候提示会话已存在的情况
    */
    startChat() {
        let { teamId } = this.props.match.params,
            sessions = getSessions();
        let cur = sessions.find( ({ id }) => {
            let accid = id.split("-")[1];
            return accid === teamId;
        } );
        if ( !cur ) {//no existed session
            this.createSession( "team", teamId ).then( () => {
                this.startChatWith( "team-" + teamId );
            } ).catch( e => {
                console.error( e );
            } )
        } else {
            this.startChatWith( cur.id );
        }
    }

    /**
     * 创建新会话
    */
    createSession( scene, to ) {
        return createSession( scene, to );
        // let mtsdk = getMtsdk();
        // return mtsdk.insertLocalSession( { scene, to } ).then( ( { session } ) => {
        //     let sessions = getSessions();
        //     store.dispatch( setSessionList( IMUtil.mergeSessions( sessions, session ) ) );
        // } ).catch( e => {
        //     console.log( e );
        // } )
    }

    /**
     * 开始聊天
    */
    startChatWith( sessionId ) {
        this.props.history.push( `/chat/session/${sessionId}` );
        this.props.setCurrentSessionId( sessionId );
    }

    /**
     * 展示群组成员列表
    */
    showMembers() {
        let { match: { params: { teamId } } } = this.props;
        let { members } = getTeamMembers(teamId) || {};
    }

    getAnchors() {
        let { teamId } = this.props.match.params;
        return [
            {
                src: talkIcon,
                clickHandler: this.startChat
            }
        ]
    }

    /**
     * 群组信息展示面板
     * 复用SamePart组件
    */
    render () {
        let { teamId } = this.props.match.params,
            { showModal } = this.props,
            { name, intro: autograph } = getTeamById( teamId );
        let avatar = getTeamAvatar( teamId );
        let anchors = this.getAnchors();
        let profiles = this.getProfiles( teamId );
        let nickProfile = this.getNickProfile( teamId );
        avatar = avatar.convertSrcWebp();
        return (
            <div className={"chat-team-main"}>
                <SamePart name={name} avatar={avatar} deleteHandler={this.showDeleteTeamVerify} anchors={anchors} autograph={autograph} profiles={profiles}/>
                <div className="profile-group mt20">
                    <ProfileItem data={nickProfile} />
                </div>
                <div className="profile-group mt20">
                    <div className={"profile-item clear"}>
                        <div className={ "profile-item-key words"}>群成员</div>
                        <div className={ "profile-item-value can-be-clicked" } onClick={undefined}>
                            <span onClick={this.props.toggleMemberlist}>查看</span>
                            <MemberList cleanCur={this.cleanCur} showModal={showModal} teamId={teamId} changeCur={this.changeCur} cur={this.state.cur} show={this.props.showMembers}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        mtsdk: state.mtsdk,
        teamMap: state.teamMap,
        teamMembers: state.teamMembers,
        showMembers: state.switchs[MEMBER_LSIT]
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        setCurrentSessionId: ( sessionId ) => dispatch( setCurrentSessionId( sessionId ) ),
        toggleMemberlist: () => dispatch( toggleSwitchs(MEMBER_LSIT) ),
        cleamTID: () => dispatch( setTeamTabId( "" ) ),
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( TeamMain ) );
