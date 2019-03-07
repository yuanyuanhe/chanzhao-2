/** @module IMBridge */
import { store } from "../redux/store";
import {
    getPersonById,
    getTeamById,
    getTeamMembers,
    getUserUID,
    getFriends,
    getPersonList,
    getBlackList,
    getTeams,
    getSessions, getDesktopNotificationSwitch, getSoundNotificationSwitch
} from "../redux/store/storeBridge";
import {
    addMsgs,
    setBlackList,
    setFriendlist,
    setTeamlist,
    setTeamMembers,
    updatePersonList,
    setSessionList,
    backoutMsg,
    addSysNotification,
    addFriendshipApply,
    setCurrentSessionId
} from "../redux/actions";

import { messageHandler } from "./msgHandler";
import {
    checkJSON,
    formatUserData,
    getMsgProfileByLastMsg,
    getSceneAndAccountBySID,
    getUserData,
    isNetease,
    sliceName
} from "../util";
import { NeteaseBridge } from "./NeteaseBridge";
import { EasemobBridge } from "./easemob/EasemobBridge";
import { updateTeam } from "../redux/actions/teamMap";
import { IMUtil } from "./IMUtil";
import {
    sendGetUserProfileRequest,
    sendGetUsersRequest,
    sendPassFriendApplyRequest,
    sendUpdateMemberAliasRequest,
    sendUpdateTeamInfoRequest
} from "../requests";
import Push from "push.js";
import { MITURES_LOGO } from '../configs/iconNames';
// 常用数据类型定义
// 由于现有服务端未能接管所有数据(比如批量拉取用户资料, 获取群成员列表等), 上层业务处理所依赖数据模型扔沿用 NIM 的结构

/**
 * A number, or a stirng containing a number.
 * @typedef {(number|string)} NumberLike
 */

/**
 * A string serialized by json object.
 * @typedef {string} JsonString
 */

/**
 * A part of user.  (Format according to NIM)
 * @typedef {Object} Friend
 * @property {NumberLike} account
 * @property {string} alias
 * @property {number} createTime - the timestamps becoming friend
 * @property {number} updateTime
 * @property {boolean} valid - false means has removed from friend list.
 */


/**
 * Enum for team mute type.
 * @readonly
 * @enum {string}
 */
const MuteType = {
    none: 'none',
    normal: 'normal',
    all: 'all'
};
/**
 * Team model (Format according to NIM)
 * @typedef {Object} Team
 * @property {NumberLike} teamId
 * @property {string} name
 * @property {string} avatar
 * @property {string} intro
 * @property {NumberLike} owner - 群主 id
 * @property {number} level - 群人数上限
 * @property {number} memberNum - 群成员数量
 * @property {number} memberUpdateTime - 群成员最后更新时间
 * @property {number} createTime
 * @property {number} updateTime
 * @property {JsonString} custom
 * @property {JsonString} serverCustom
 * @property {boolean} valid - 是否有效, 解散后该群无效
 * @property {boolean} validToCurrentUser - 该群是否对当前用户有效, 如果无效说明被踢了
 * @property {boolean} mute
 * @property {MuteType} muteType
 */

/**
 * Enum for team member type.
 * @readonly
 * @enum {string}
 */
const MemberType = {
    normal: 'normal',
    owner: 'owner',
    manager: 'manager'
};
/**
 * Team member model.
 * @typedef {Object} TeamMember
 * @property {NumberLike} teamId
 * @property {NumberLike} account
 * @property {MemberType} type
 * @property {string} nickInTeam
 * @property {number} joinTime
 * @property {number} updateTime
 */

/**
 * FriendAction 目前用于格式化 NIM 的好友相关通知
 * @typedef {Object} FriendAction
 * @property {FriendActionTypes} type
 * @property {NumberLike} account
 */
/**
 * Enum for FriendActionTypes
 * @readonly
 * @enum {string}
 */
const NIMFriendActionTypes = {
    ADD: 'addFriend',
    APPLY: 'applyFriend',
    PASS: 'passFriendApply',
    REJECT: 'rejectFriendApply',
    DELETE: 'deleteFriend',
    UPDATE: 'updateFriend'
};
export const FriendActionTypes = NIMFriendActionTypes;

/**
 * Enum for SystemMessageTypes
 * @readonly
 * @enum {string}
 */
const NIMSystemMessageTypes = {
    DELETE_MSG: 'deleteMsg',
    ADD_FRIEND: FriendActionTypes.ADD,
    PASS_FRIEND_APPLY: FriendActionTypes.PASS,
    DELETE_FRIEND: FriendActionTypes.DELETE,
    APPLY_FRIEND: FriendActionTypes.APPLY,
    // ....
};
export const SystemMessageTypes = NIMSystemMessageTypes;

let generalDone = ( resolve, reject ) => {
    return ( err, obj ) => {
        if ( !err ) {
            resolve( obj );
        } else {
            console.log( err );
            reject( err );
        }
    }
};

let _sharedSDKBridge;

/**
 * As a singleton.
 */
export class IMBridge {

    /**
     * Initialize the singleton of IMBridge.
     * @param configs
     * @param connectedCallback
     */
    constructor( configs, connectedCallback ) {
        if ( !!_sharedSDKBridge ) {
            typeof connectedCallback === 'function' && connectedCallback();
            return;
        }

        if ( isNetease() ) {
            this.imsdk = new NeteaseBridge( configs, connectedCallback );
        } else {
            this.imsdk = new EasemobBridge( configs );
        }

        _sharedSDKBridge = this;
    }

    static get shared() {
        return _sharedSDKBridge;
    }

    //主动断开sdk连接, 充值 IMBridge 单例
    static disconnect() {
        this.shared.imsdk.nim.disconnect();
        _sharedSDKBridge = undefined;
    }

    /***************** Event Handler ****************/
    static onConnect = () => {
        console.log( "连接成功" );
    };

    static onDisconnet = error => {
        console.log( error );
    };

    static onError = error => {
        console.log( error );
    };

    static onWillReconnect = obj => {
        console.log( "reconnecting...." );
        console.log( obj );
    };

    static onMsg = msg => {
        console.log( '收到消息', msg.scene, msg.type, msg );
        let userUID = getUserUID(),
            who = msg.to === userUID ? msg.from : msg.to;

        // 非群通知消息处理
        if ( /text|image|file|audio|video|geo|custom|tip/i.test( msg.type ) ) {
            let account = ( msg.scene === "p2p" ? who : msg.from ),
                userData = getPersonById( account );
            if ( !userData ) { // user data not been cached
                this.getUser( account ) .then( data => {
                        store.dispatch( updatePersonList( data ) );
                    } );
            }
            IMBridge.triggerMsgNotification( msg );
            store.dispatch( addMsgs( msg ) );
        } else { // 群通知消息处理
            messageHandler( msg );
        }
    };

    static triggerMsgNotification = ( msg ) => {
        let userUID = getUserUID(),
            desktopSwitchState = getDesktopNotificationSwitch(),
            soundSwitchState = getSoundNotificationSwitch();
        let hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null;
        //当前标签页未获得焦点同时消息发送方不是自己
        if ( !!msg && document[ hiddenProperty ] && msg.from !== userUID ) {
            if ( desktopSwitchState ) {
                Push.create( "新的消息", {
                    body: getMsgProfileByLastMsg( msg ),
                    icon: MITURES_LOGO.convertIconSrc(),
                    timeout: 4000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                } );
            }
            if ( soundSwitchState ) {
                document.querySelector( '#tip-music' ).play().catch( e => {
                    console.log( "sound error: ", e );
                } );
            }
        }
    };

    // 目前只用于处理离线和漫游消息
    static saveMsgs = ( msgs ) => {
        store.dispatch( addMsgs( msgs ) );
    };

    static onAddTeamMembers( teamMember ) {
        console.log( "on add team members", teamMember );

        let newMembers = teamMember.members,
            teamId = teamMember.team.teamId,
            teamMembers = getTeamMembers( teamId );
        teamMembers.members = teamMembers.members.concat( newMembers );
        store.dispatch( setTeamMembers( teamId, teamMembers ) );
    }

    static onRemoveTeamMembers( teamMember ) {
        console.log( "onRemoveTeamMembers", teamMember );
        let removeAccounts = teamMember.accounts,
            teamId = teamMember.team.teamId,
            teamMembers = getTeamMembers( teamId );
        let result = teamMembers.members.filter( member => !removeAccounts.includes( member.account ) );
        store.dispatch( setTeamMembers( teamId, result ) );
    }

    static onUpdateTeamMember( teamMember ) {
        console.log( 'onupdateteammember' );
        let teamId = teamMember.teamId,
            teamMembers = getTeamMembers( teamId );
        teamMembers || ( teamMembers = { teamId, members: [] } );
        teamMembers.members = IMUtil.mergeTeamMembers( teamMembers.members, teamMember );
        teamMembers.members = IMUtil.cutTeamMembers( teamMembers.members, teamMember.invalid );
        store.dispatch( setTeamMembers( teamId, teamMembers ) );
    }

    static onDismissTeam( team ) {
        console.log( "onDismissTeam", team );
        let teamId = team.teamId,
            teamMsg = getTeamById( teamId );
        teamMsg.valid = false;
        store.dispatch( updateTeam( teamId, teamMsg ) );
    }

    static onTeams( teams ) {
        let teamlist = Object.values( getTeams() );
        teamlist = IMUtil.mergeTeams( teamlist, teams );
        teamlist = IMUtil.cutTeams( teamlist, teams.invalid );
        store.dispatch( setTeamlist( teamlist ) ); // change to update is better ?
    }

    static onFriends( friends ) {
        let friendlist = getFriends();
        friendlist = IMUtil.mergeFriends( friendlist, friends );
        friendlist = IMUtil.cutFriends( friendlist, friends.invalid );
        store.dispatch( setFriendlist( friendlist ) );
    }

    // process friend relationship in other sides
    static onSyncFriendAction( action ) {
        switch ( action.type ) {
            case FriendActionTypes.ADD:
            case FriendActionTypes.PASS:
                this.onAddFriend( action.account );
                break;
            case FriendActionTypes.DELETE:
                this.onDeleteFriend( action.account );
                break;
            case FriendActionTypes.UPDATE:
                this.onUpdateFriend( action.account );
                break;
            case FriendActionTypes.APPLY:
            case FriendActionTypes.REJECT:
            default:
                break;
        }
    }

    static onAddFriend( friend ) {
        store.dispatch( setFriendlist( IMUtil.mergeFriends( getFriends(), friend ) ) );
    }

    static onDeleteFriend( account ) {
        store.dispatch( setFriendlist( IMUtil.cutFriendsByAccounts( getFriends(), account ) ) );
    }

    static onUpdateFriend( friend ) {
        store.dispatch( setFriendlist( IMUtil.mergeFriends( getFriends(), friend ) ) );
    }

    static onUsers( users ) {
        let personlist = Object.values( getPersonList() );
        personlist = IMUtil.mergeUsers( personlist, users.map( user => formatUserData( user ) ) );
        store.dispatch( updatePersonList( personlist ) );
    }

    static onUpdateUser( user ) {
        store.dispatch( updatePersonList( IMUtil.mergeUsers( getPersonList(), formatUserData( user ) ) ) );
    }

    static onBlacklist( blacklist ) {
        let list = getBlackList();
        list = IMUtil.mergeRelations( list, blacklist );
        list = IMUtil.cutRelations( list, blacklist.invalid );
        store.dispatch( setBlackList( list ) );
    }

    static onMutelist( mutelist ) {

    }

    static onOfflineSysMsgs( sysMsgs ) {
        console.log( "on offline system messages", sysMsgs );
        sysMsgs.forEach( msg => this.onSysMsg( false, msg ) );
    }

    static onRevokeMsg( sid, cid, msg ) {
        let { from, target: to, time } = msg,
            userUID = getUserUID();
        this.shared.imsdk.nim.sendTipMsg( {
            isLocal: true,
            scene: msg.scene,
            to,
            // 隐式类型转换 NumberLike
            tip: sliceName( userUID == from ? '你' : getUserData( getPersonById( from ) ).alias, 12 ) + '撤回了一条消息',
            time,
            done: (err, data) => {
                if ( !err ) {
                    store.dispatch( backoutMsg( sid, cid, data ) );
                }
            }
        } )
    }

    static onSysMsg( newMsg, data ) {
        console.log( "收到系统通知", newMsg, data );
        const type = data.type;
        if ( !type ) {
            return;
        }

        switch ( type ) {
            case SystemMessageTypes.DELETE_MSG:
                this.onRevokeMsg( data.msg.sessionId, data.deleteIdClient, data.msg );
                break;
            case SystemMessageTypes.PASS_FRIEND_APPLY:
            // var friendAccount = msg.from;
            // this.getPersonMsg( friendAccount, ctr.passFriendApplyHandler.bind( ctr ) );
                break;
            case SystemMessageTypes.DELETE_FRIEND:
                // var deletedUid = ( msg.from + "" ) === ( userUID + "" ) ? msg.to: msg.from;
                // //缓存删除好友
                // cache.removeFriend( deletedUid );
                // //删除好友会话
                // ctr.deleteLocalSession('p2p-' + deletedUid );
                // //通讯录删除好友
                // ctr.ui.initAbFriendList();
                break;
            case SystemMessageTypes.APPLY_FRIEND:
                let { ps, idServer, from: account } = data,
                    params = { ps, account, allow: false, idServer };
                this.getUser( account ).then( user => {
                    store.dispatch( updatePersonList( user ) );
                    return user;
                } ).finally(() => {
                    store.dispatch( addFriendshipApply( params ) );
                });
                break;
            default:
                console.log( data );
                break;
        }

    }

    static onCustomSysMsg( msg ) {
        if ( typeof DEBUG !== "undefined" ) {
            console.log( '收到自定义系统通知', msg );
        }

        let data = checkJSON( !!msg.content ? msg.content : null );
        if ( !data ) {
            return false;
        }

        let type = data.content.type;
        switch ( type ) {
            case 1: // 好友发布了一条说说
            case 2: // 有人赞了自己的说说
            case 3: // 偶人评论了自己的说说
            case 4: // 秘圈被转发
                console.log( data, data.content )
                store.dispatch( addSysNotification( data.content ) );
                break;
            case 8: // 红包被领取
                break;
            default:
                break;
        }

    }

    static onOfflineCustomSysMsgs( msgs ) {

    }

    static onMyInfo( data ) {
        store.dispatch( updatePersonList( formatUserData( data ) ) );
    }

    static onSyncCreateTeam( teams ) {
        console.log( "on sync create team", teams );
        store.dispatch( setTeamlist( teams ) );
    }

    static onSyncMarkinBlacklist( obj ) {
        let handler = !!obj.isAdd ? IMUtil.mergeRelations : IMUtil.cutRelations;
        store.dispatch( setBlackList( handler( getBlackList(), obj.record ) ) );
    }

    static onSyncMarkinMutelist( param ) {

    }

    static onSyncDone( connectedCallback ) {
        !!connectedCallback && connectedCallback();
    }

    static onSessions( sessions ) {
        let olds = getSessions();
        sessions = IMUtil.mergeSessions( olds, sessions );
        console.log( 'on sessions: ', sessions );
        sessions.forEach( session => {
            if ( session.scene === "team" ) {
                let teamId = session.to;
                if ( !getTeamMembers( teamId ) ) {
                    this.getTeamMembers( teamId );
                }
            }
        } );
        store.dispatch( setSessionList( sessions ) );
    }

    static onUpdateSession( session ) {
        store.dispatch( setSessionList( IMUtil.mergeSessions( getSessions(), session ) ) );
    }

    /******** Business ***********/

    static getHistoryMsgs( { sid, limit = 20, endTime } ) {
        return new Promise( ( resolve, reject ) => {
            sid || ( reject( new Error( 'sid is undefined' ) ) );
            let { scene, account } = getSceneAndAccountBySID( sid );
            this.shared.imsdk.nim.getHistoryMsgs( {
                scene,
                to: account,
                limit,
                endTime,
                reverse: false,
                done: generalDone( resolve, reject )
            } );
        } );
    }

    /**
     * 发送消息已读回执
     * 目前只支持 'p2p' 会话
     * 如果没有传入消息, 则直接返回成功
     * 如果已经发送过比传入的消息的时间戳大的已读回执, 那么直接返回成功
     *
     * @param msg 要发送已读回执的会话的最后一条收到的消息, 可以直接通过 sessio.lastMsg 来获取此消息
     * @param done finish callback
     * @returns {Promise}
     */
    static sendMsgReceipt( { msg } ) {
        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.sendMsgReceipt( {
                msg,
                done: generalDone( resolve, reject )
            } )
        } ).then( () => ( { msg } ) );
    }

    static sendTextMsg( { scene, to, text, custom, isLocal = false, isHistoryable = true, isRoamingable = true, isSyncable = true } ) {
        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.sendText( {
                scene, to, text, isLocal, isHistoryable, isRoamingable, isSyncable, custom,
                done: generalDone( resolve, reject )
            } )
        } ).then( msg => ( { msg } ) );
    }

    /**
     * 发送自定义消息
     * @param {string} scene - 场景, 'p2p' || 'team'
     * @param {string|number} to - _ 消息接收方
     * @param {string} content - 消息内容对象, json string
     * @return {*|Promise<{msg: any}>}
     */
    static sendCustomMsg( { scene, to, content } ) {
        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.sendCustomMsg( {
                scene, to, content,
                done: generalDone( resolve, reject )
            } )
        } ).then( msg => ( { msg } ) );
    }

    /**
     * 发送文件消息
     * @param sid
     * @param file
     * @param uploadprogress
     * @param uploaddone
     * @return {*}
     */
    static sendFileMsg( { sid, file, uploadprogress, uploaddone } ) {
        if ( !sid ) {
            return Promise.reject();
        }

        let { scene, account: to } = getSceneAndAccountBySID( sid ),
            value = file.value,
            ext = value.substring( value.lastIndexOf( '.' ) + 1, value.length ),
            type = /png|jpg|jpeg|gif|bmp|webp/i.test( ext ) ? 'image' : 'file',
            text = type === 'file' ? '[文件]' : '[图片]',
            custom = {},
            userUID = getUserUID();
        custom.pushContent = getUserData( getPersonById( userUID ) ).name + ":" + text;
        custom = JSON.stringify( custom );

        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.sendFile( {
                scene, to, type, custom, uploadprogress, uploaddone,
                blob: file,
                uploaderror: err => reject( err ),
                beforesend: msgId => { },
                done: generalDone( resolve, reject )
            } )
        } );
        // uploaddone: function ( error, file ) {
        //     that.controller.ui.showAlert('上传' + (!error ? '成功' : '失败'));
        //     delete that.controller.uploadingSessionIds[ sessionId ];
        //     if (typeof DEBUG !== "undefined") {
        //         if ( error ) {
        //             console.log( "uploadError", error );
        //         }
        //     }
        //
        // },
    }

    /**
     * 获取群成员
     * @param teamId 群 ID
     * @returns {Promise<TeamMember>}
     */
    static getTeamMembers( teamId ) {
        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.getTeamMembers( {
                teamId,
                done: generalDone( resolve, reject )
            } );
        } ).then( obj => {
            store.dispatch( setTeamMembers( teamId, obj ) );
            return obj;
        } );
    };

    /**
     *  更新群资料
     * @param {object} teamInfo
     * @param {string} teamInfo.teamId
     * @param {string} [teamInfo.avatar]
     * @param {string} [teamInfo.name]
     * @param {string} [teamInfo.intro]
     * @returns {Promise}
     */
    static updateTeam( teamInfo ) {
        return new Promise( ( resolve, reject ) => {
            teamInfo.teamId || ( reject( new Error( 'teamId is undefined' ) ) );
            sendUpdateTeamInfoRequest( {
            // this.shared.imsdk.nim.updateTeam( {
                ...teamInfo,
                done: generalDone
            } )
        } );
    }

    /**
     * 修改自己对于某个群的属性
     * @param {object} options
     * @param {string} options.teamId
     * @param {string} [options.nickInTeam]
     * @return {Promise}
     */
    static updateInfoInTeam( options ) {
        return new Promise( ( resolve, reject ) => {
            let { teamId: tid, nickName} = options;
            tid || ( reject( new Error( 'teamId is undefined' ) ) );
            sendUpdateMemberAliasRequest( {
                tid, nickName
            } );
        } );
    }

    /**
     * Format a Friend object from a person.
     * 可能 person 类型要改成跟 server 统一
     * @param person
     * @return {Friend}
     */
    static formatFriendFromPerson( {account, updateTime} ) {
        return {
            account, updateTime,
            createTime: Date.now(),
            alias: '',
        }
    }

    /**
     * 通过好友申请
     * @param {string} idServer - 对应的系统通知的 idServer
     * @param {string} account - 要通过好友申请的账号
     * @param {string} [ps] - 附言, 选填, 也可使用 json 格式字符串来扩展此内容
     * @return {Promise}
     */
    static passFriendApply( { idServer, account, ps } ) {
        return sendPassFriendApplyRequest( account ).then( ( { msgId } ) => {
            if ( msgId !== '200' ) {
                let errorString = 'pass friend apply error as msgId equal to ' + msgId;
                throw new Error( errorString );
            }
            return { friend: this.formatFriendFromPerson( getPersonById( account ) ) };
        } );
    }

    /**
     * 获取用户名片
     * 目前 getUser 数据源为 server, 因没有批量拉取用户资料接口, 初始化时 onusers 仍延用 NIM
     * 导致目前格式化用户数据分为 data.custom 和 data 直接字段映射
     * @param {string} account - 用户账号
     * @return {Promise}
     */
    static getUser( account ) {
        return new Promise( ( resolve, reject ) => {
            sendGetUserProfileRequest( account ).then( res => {
                if ( res.msgId === '200' ) {
                    let userData = { ...res.profile, account: res.profile.uid };
                    resolve( formatUserData( userData ) );
                    // resolve( { ...res.profile, account: res.profile.uid } );
                } else {
                    reject( new Error( 'fail: get user data from server' ) )
                }
            } );
        } );
    }

    /**
     * 获取用户名片数组
     * 目前云信单次限制 150 条, 服务端虽不做限制但为避免 url 超长仍沿用该限制
     * @param {string[]} accounts
     * @return {Promise}
     */
    static getUsers( accounts ) {
        function paging( accounts ) {
            const accountNumInPage = 150;
            if ( accounts.length <= accountNumInPage ) {
                return [ accounts ];
            }

            let result = [], index = 0;
            while ( index < accounts.length ) {
                result.push( accounts.slice( index, index += accountNumInPage ) );
            }
            return result;
        }

        // 按需替换此方法实现即可
        function innerGetInfo( innerAccounts ) {
            return new Promise( ( resolve, reject ) => {
                sendGetUsersRequest( innerAccounts ).then( res => {
                    // 始终 resolve, 避免单页请求失败导致所有失效
                    let result = [];
                    if ( res.msgId === '200' ) {
                        result = res.users;
                    }
                    resolve( result );
                } );
            } ).then( users => users.map( user => formatUserData( user ) ) );
        }

        let innerGetPromises = paging( accounts ).map( innerGetInfo );
        return Promise.all( innerGetPromises )
            .then( dataArrays => [].concat.apply( [], dataArrays ) )
            .then( personlist => {
                store.dispatch( updatePersonList( personlist ) );
                return personlist;
            } );
    }

    static setCurrSession( { scene, to } ) {
        let sessionId = scene + "-" + to;
        this.shared.imsdk.nim.setCurrSession(sessionId);
        store.dispatch( setCurrentSessionId( sessionId ) );
    }

    static resetSessionUnread( sid ) {
        this.shared.imsdk.nim.resetSessionUnread( sid );
    }

    static insertLocalSession( { scene, to } ) {
        return new Promise( ( resolve, reject ) => {
            this.shared.imsdk.nim.insertLocalSession( { scene, to, done: generalDone( resolve, reject ) } )
        } );
    }
}

