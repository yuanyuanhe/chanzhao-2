import {store} from "../redux/store";
import {setCurrentSessionId, setSessionList} from "../redux/actions";
import {getMtsdk, getSessions} from "../redux/store/storeBridge";
import { IMUtil } from "../SDK/IMUtil";

//start chat with user
export function startChatWith( account, history ) {
    let sessions = getSessions();
    let cur = sessions.find( ({ id }) => {
        let accid = id.split("-")[1];
        return accid == account;
    } );
    if ( !cur ) {//no existed session
        return createSession( "p2p", account ).then( () => {
            store.dispatch( setCurrentSessionId( "p2p-" + account ) );
            return jumpToChatWith( "p2p-" + account, history );
        } ).catch( e => {
            console.log( e );
        } )
    } else {
        return Promise.resolve( jumpToChatWith( cur.id, history ) );
    }
}

export function createSession( scene, to ) {
    let mtsdk = getMtsdk();
    return mtsdk.insertLocalSession( { scene, to } ).then( ( { session } ) => {
        let sessions = getSessions();
        store.dispatch( setSessionList( IMUtil.mergeSessions( sessions, session ) ) );
    } ).catch( e => {
        let { message } = e;
        if ( !message ) {
            return Promise.reject(e);
        } else if ( message === '会话已存在' ) {
            let session = createFakeSession( scene, to );
            let sessions = getSessions();
            store.dispatch( setSessionList( IMUtil.mergeSessions( sessions, session ) ) );
            return Promise.resolve();
        }
    } );
}

export function createFakeSession( scene, to ) {
    let session = {
        id: [ scene, to ].join( '-' ),
        scene,
        to,
        updateTime: Date.now(),
        unread: 0,
        lastMsg: undefined
    };
    return session;
}

function jumpToChatWith( sessionId, history ) {
    history.replace( `/chat/session/${sessionId}` );
    store.dispatch( setCurrentSessionId( sessionId ) )
}