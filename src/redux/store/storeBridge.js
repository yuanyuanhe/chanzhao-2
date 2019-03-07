import { store } from "./index";
import localConfig from "../../configs/localConfig";
import {CHATTING_HISTORY, DESKTOP, SOUND} from "../../configs/consts";
/**
 * 从redux中获取某些属性的包装层
 * 写错了，组件获取redux值应该用connect，不需要包装这一层
*/
//team
export function getTeams() {
    let { teamMap = {} } = store.getState();
    return teamMap;
}
export function getTeamMembers( id ) {
    let { teamMembers = {} } = store.getState();
    return teamMembers[ id ] || null;
}

export function getNickInTeam( uid, id ) {
    let teamMebers = getTeamMembers( id );
    if ( !teamMebers ) {
        return "";
    }
    return ( teamMebers.members.find( ( { account } ) => {
        return account == uid
    } ) || { nickInTeam: "" } ).nickInTeam;
}

export function hasTeam( id ) {
    let { teamMap = {} } = store.getState();
    return !!teamMap[ id ]
}

export function getTeamById( id ) {
    let { teamMap = {} } = store.getState();
    let team = teamMap[ id ];
    return !!team ? team : null;
}

export function getTeamAvatar( id ) {
    let defaultTeamAvatar = getDefaultTeamAvatar();
    let { avatar = defaultTeamAvatar } = getTeamById( id );
    avatar = avatar || defaultTeamAvatar.convertIconSrc();
    return avatar.convertSrcWebp();
}

export function isTeamManager( id, account ) {
    account = account || getUserUID();
    let { members } = getTeamMembers( id ) || {};
    if ( members ) {
        for ( let i = members.length - 1; i >= 0; i--) {
            if ( members[i].account == account && ( members[i].type === 'owner' || members[i].type === 'manager' ) ) {
                return true
            }
        }
    }
    return false
}

export function getTeamOwner( id ) {
    let team = getTeamById( id );
    if ( !!team )  {
        return team.owner;
    }
    return "";
}

//friends
export function getFriends() {
    let { friendlist = [] } = store.getState();
    return friendlist;
}

export function getFriendById( uid ) {
    let friends = getFriends();
    for ( let i = friends.length - 1; i >= 0; --i ) {
        let item = friends[i];
        if ( !!item ) {
            if ( item.account === uid  ) {
                return item;
            }
        }
    }
    return null;
}

export function isFriend( uid ) {
    let friends = getFriends();
    for ( let i = friends.length - 1; i >= 0; --i ) {
        let item = friends[i];
        if ( !!item ) {
            if ( item.account === uid  ) {
                return true;
            }
        }
    }
    return false;
}

export function getFriendAlias( uid ) {
    if ( !isFriend( uid ) ) {
        return false;
    }
    let friend = getFriendById( uid );
    return friend.alias || "";
}

//sessions
export function getSessions() {
    let{ sessions = {} } = store.getState();
    return sessions;
}
export function getSessionById( sessionId ) {
    let sessions = getSessions();
    return sessions.find( v => {
        return v.id === sessionId
    } ) || {};
}

//personlist
export function getPersonList() {
    let{ personlist = {} } = store.getState();
    return personlist;
}

export function getPersonById( id ) {
    let { personlist = {} } = store.getState();
    let user = personlist[ id ];
    return !!user ? user : null;
}

//blacklist
export function getBlackList() {
    let { blackList = [] } = store.getState();
    return blackList;
}

//personlist
export function getUserUID() {
    let { userUID } = store.getState();
    return userUID;
}

//msg
export function getMsgs( sessionId ) {
    let { msgs } = store.getState();
    return !!msgs[ sessionId ] ? msgs[ sessionId ] : [];
}

//msgHistory
export function getHistoryMsgs( sessionId ) {
    let { historyMsg } = store.getState();
    return !!historyMsg[ sessionId ] ? historyMsg[ sessionId ] : [];
}

//查消息 session-id idClient
export function findMsg( sid, cid ) {
    let list = getMsgs( sid );
    if ( list.length === 0 ) {
        return false;
    }
    for ( let i = list.length - 1; i >= 0; --i ) {
        if ( list[ i ].idClient === cid ) {
            return list[ i ];
        }
    };
    return false
}

export function getCurrentSessionId() {
    let { currentSessionId } = store.getState();
    return currentSessionId;
}

//token
export function getServerToken() {
    let { serverToken } = store.getState();
    return serverToken;
}

//aesKey
export function getAesKey() {
    let { aesKey } = store.getState();
    return aesKey;
}

//mtsdk
export function getMtsdk() {
    let { mtsdk } = store.getState();
    return mtsdk;
}

//nim
export function getNIM() {
    let { mtsdk: { nim } } = store.getState();
    return nim;
}

//url
export function getUrl( key, params ) {
    let { urls, root } = localConfig;
    // 没有必要啊, 外面传个字符串还容易错
    // urls.addTeamMember() 就够了啊
    return root + urls[ key ]( params );
}

export function getDefaultTeamAvatar() {
    let { defaultTeamAvatar } = localConfig;
    return defaultTeamAvatar;
}

//focusedUsers
export function userIsFocused( accountToCheck, userAccount ) {
    userAccount = userAccount || getUserUID();
    let { focusedUsers } = store.getState(),
        accounts = focusedUsers[ accountToCheck ];
    if ( !accounts ) {
        return false;
    }
    for ( let key in accounts ) {
        let item = accounts[ key ];
        if ( !!item.find( ( { uid = "" } ) => uid == accountToCheck ) ) {
            return true;
        }
    }
    return false;
}

//focusedUsersPage
export function getFocusedUsersPage( account ) {
    let { focusedUsersPage: { [account]: page } } = store.getState();
    return page || 1;
}

//fansPage
export function getFansPage( account ) {
    let { fansPage: { [account]: page } } = store.getState();
    return page || 1;
}

export function getImageRoot() {
    let { imageRoot } = store.getState();
    return imageRoot;
}

export function getBucket() {
    let { serverConfig: { oss: { bucket_name } } } = store.getState();
    return bucket_name;
}
//searchWords
export function getSearchWords() {
    let { searchWords } = store.getState();
    return searchWords;
}

//switchs
export function getHistoryStateBySID( sid ) {
    return store.getState().switchs[CHATTING_HISTORY][sid];
}
export function getDesktopNotificationSwitch() {
    return store.getState().switchs[DESKTOP];
}
export function getSoundNotificationSwitch() {
    return store.getState().switchs[SOUND];
}
//moments
export function getMoments( momentType ) {
    let { moments } = store.getState();
    return moments[ momentType ] || [];
}