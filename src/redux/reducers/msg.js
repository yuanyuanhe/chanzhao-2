import {ADD_MSG, ADD_MSGS, SET_MSG, BACKOUT_MSG} from "../actionTypes";
import {getMsgs, getUserUID} from "../store/storeBridge";
import { TEAM, P2P } from '../../configs/consts';

export function msgs(state = {}, action ) {
    switch ( action.type ) {
        case ADD_MSG:
            return addMsg( state, action.msg, action.userUID );
        case ADD_MSGS:
            return addMsgs( state, action.msgs, action.userUID );
        case SET_MSG:
            return setMsg( state, action.sid, action.cid, action.msg, action.userUID );
        case BACKOUT_MSG:
            return backoutMsg( state, action.sid, action.cid, action.msg, action.userUID );
        default:
            return state;
    }
}

function backoutMsg( oldMsgs, sid, cid, msg, userUID ) {
    let list = oldMsgs[ sid ];
    if ( !list ) {
        oldMsgs[ sid ] = [ msg ]
        return oldMsgs;
    }
    for ( let i = list.length - 1; i >= 0; --i ) {
        if ( list[ i ].idClient === cid ) {
            list[ i ] = msg;
            return oldMsgs;
        }
    }
    oldMsgs[sid].push(msg);
    return oldMsgs;
};

function setMsg( oldMsgs, sid, cid, msg, userUID  ) {
    let msgCache = Object.assign( {}, oldMsgs ),
        list = msgCache[ sid ];
    if ( !list || list.length === 0 ) {
        return msgCache;
    }
    for ( let i = list.length - 1; i >= 0; --i ) {
      if ( list[ i ].idClient === cid ) {
        list.splice( i, 1 );
        list.push( msg );
        return msgCache;
      }
    };
    return msgCache;
}

function addMsg( msgs, msg, userUID  ) {
    let user,
        msgCache = Object.assign( {}, msgs );
    if ( msg.scene === TEAM ) {
        user = TEAM + "-" + msg.to;
        if ( !msgCache[ user ] ) {
            msgCache[ user ] = [];
        }
        msgCache[ user ].push( msg );
    } else {
        user = P2P + "-" + ( msg.from == userUID ? msg.to : msg.from );
        if ( !msgCache[ user ] ) {
            msgCache[ user ] = [];
        }
        msgCache[ user ].push(msg);
    }
    return msgCache;
}

function addMsgs( oldMsgs, msgs, userUID  ) {
    if ( !Array.isArray( msgs ) ) {
        return addMsg( oldMsgs, msgs );
    }
    let msgCache = Object.assign( {}, oldMsgs );
    let user;
    for ( let i = 0; i < msgs.length; i++) {
        if ( msgs[ i ].scene === TEAM ) {
            user = msgs[ i ].to;
            if ( !msgCache[ TEAM + "-" + user ] ) {
                msgCache[ TEAM + "-" + user ] = [];
            }
            msgCache[ TEAM + "-" + user ].push( msgs[ i ] );
        } else {
            user = ( msgs[ i ].from == userUID ? msgs[ i ].to : msgs[ i ].from );
            if ( !msgCache[ P2P + "-" + user ] ) {
                msgCache[ P2P + "-" + user ] = [];
            }
            msgCache[ P2P + "-" + user ].push( msgs[ i ] );
        }
    }
    return msgCache;
}