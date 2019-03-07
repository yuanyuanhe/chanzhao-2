import { FriendActionTypes, IMBridge } from "./IMBridge";

//data: { appKey, account, token }
let NIM = window.NIM;

export function NeteaseBridge( data, connectedCallback ) {
    let { appKey, account, token } = data;
    // this.team = [];
    console.log( 'im sdk: ' + process.env.REACT_APP_IM_SDK );
    this.nim = NIM.getInstance( {
        appKey,
        account,
        token,
        db: false,
        //connect
        onconnect: onConnect.bind( this ),
        ondisconnect: onDisconnect.bind( this ),
        onerror: onError.bind( this ),
        onwillreconnect: onWillReconnect.bind( this ),
        onsyncdone: onSyncDone.bind( this, connectedCallback ),
        //session
        syncSessionUnread: true,
        onsessions: onSessions.bind( this ),
        onupdatesession: onUpdateSession.bind( this ),
        //msg
        onmsg: onMsg.bind( this ),
        //users
        onusers: onUsers.bind( this ),
        //team
        syncTeamMembers: false,//close sync team members
        onteams: onTeams.bind( this ),
        onupdateteammember: onUpdateteamMember.bind( this ),
        onAddTeamMembers: onAddTeamMembers.bind( this ),
        onRemoveTeamMembers: onRemoveTeamMembers.bind( this ),
        onDismissTeam: onDismissTeam.bind( this ),
        onsynccreateteam: onSyncCreateteam.bind( this ),
        //friends
        onfriends: onFriends.bind( this ),
        onsyncfriendaction: onSyncFriendAction.bind( this ),
        //user info
        onmyinfo: onMyInfo.bind( this ),
        onupdatemyinfo: onMyInfo.bind( this ),
        //system msg
        onsysmsg: onSysMsg.bind( this, 1 ),
        onupdatesysmsg: onSysMsg.bind( this, 0 ),
        //custom system msg
        oncustomsysmsg: onCustomSysMsg.bind( this ),
        //offline msgs
        // onroamingmsgs: saveMsgs.bind( this ),
        // onofflinemsgs: saveMsgs.bind( this ),
        onofflinesysmsgs: onOfflineSysmsgs.bind( this ),
        onofflinecustomsysmsgs: onOfflineCustomSysMsgs.bind( this ),
        // 静音，黑名单
        onmutelist: onMutelist.bind( this ),
        onblacklist: onBlacklist.bind( this ),
        onsyncmarkinblacklist: onSyncMarkinBlacklist.bind( this ),
        onsyncmarkinmutelist: onSyncMarkinMutelist.bind( this ),
    } );
}

/******************** Event Handler ******************/

function onConnect() {
    IMBridge.onConnect();
}

function onDisconnect( error ) {
    IMBridge.onDisconnet( error );
}

function onError( error ) {
    IMBridge.onError( error );
}

function onWillReconnect( obj ) {
    IMBridge.onWillReconnect( obj );
}

function saveMsgs( { msgs } ) {
    IMBridge.saveMsgs( msgs );
}

function onMsg( msg ) {
    IMBridge.onMsg( msg );
}

function onAddTeamMembers( teamMember ) {
    IMBridge.onAddTeamMembers( teamMember );
}

function onRemoveTeamMembers( teamMember ) {
    IMBridge.onRemoveTeamMembers( teamMember );
}


function onUpdateteamMember( teamMember ) {
    IMBridge.onUpdateTeamMember( teamMember );
}

function onDismissTeam( team ) {
    IMBridge.onDismissTeam( team );
}

function onTeams( teams ) {
    IMBridge.onTeams( teams );
}

function onFriends( friends ) {
    IMBridge.onFriends( friends );
}

function formatFriendAction( obj ) {
    let type, account;
    switch (obj.type) {
        case 'addFriend':
            type = FriendActionTypes.ADD;
            account = obj.friend;
            break;
        case 'applyFriend':
            type = FriendActionTypes.APPLY;
            break;
        case 'passFriendApply':
            type = FriendActionTypes.PASS;
            account = obj.friend;
            break;
        case 'rejectFriendApply':
            type = FriendActionTypes.REJECT;
            break;
        case 'deleteFriend':
            type = FriendActionTypes.DELETE;
            account = obj.account;
            break;
        case 'updateFriend':
            type = FriendActionTypes.UPDATE;
            account = obj.friend;
            break;
    }
    return { type, account }
}
//process friend relationship in other sides
function onSyncFriendAction( obj ) {
    let action = formatFriendAction( obj );
    IMBridge.onSyncFriendAction( action );
}

function onUsers(users) {
    IMBridge.onUsers( users );
}

function onUpdateUser(user) {
    IMBridge.onUpdateUser( user );
}

function onSyncDone( connectedCallback ) {
    // TODO: 部分数据同步可以放在具体组件渲染之前, 以此来加快初次渲染速度
    IMBridge.onSyncDone( connectedCallback );
}

function onOfflineSysmsgs( sysMsgs ) {
    IMBridge.onOfflineSysMsgs( sysMsgs );
}

function formatSysMsg( msg ) {

}
function onSysMsg( newMsg, data ) {
    return IMBridge.onSysMsg( newMsg, data );
}

function onCustomSysMsg(msg){
    IMBridge.onCustomSysMsg( msg );
}

function onOfflineCustomSysMsgs( msgs ) {
    IMBridge.onOfflineCustomSysMsgs( msgs );
}

function onBlacklist( blacklist ) {
    IMBridge.onBlacklist( blacklist );
}

function onMutelist( mutelist ) {
    IMBridge.onMutelist( mutelist );
}

function formatUserInfo( data ) {
    return data;
}
function onMyInfo( data ){
    IMBridge.onMyInfo( formatUserInfo( data ) );
}

function formatTeamInfo( team ) {
    return team;
}
function onSyncCreateteam( teams ) {
    !teams && (teams = []);
    Array.isArray( teams ) || ( teams = [ teams ] );
    IMBridge.onSyncCreateTeam( teams.map( team => formatTeamInfo( team ) ) );
}

function onSyncMarkinBlacklist( obj ) {
    IMBridge.onSyncMarkinBlacklist( obj );
}

function onSyncMarkinMutelist( param ) {
    IMBridge.onSyncMarkinMutelist( param );
}

function onSessions( sessions ) {
    IMBridge.onSessions( sessions );
}

function onUpdateSession( session ) {
    IMBridge.onUpdateSession( session );
}
