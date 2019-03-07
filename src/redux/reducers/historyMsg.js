import {ADD_HISTORY_MSG_BY_REVERSE, SET_HISTORY_MSG} from "../actionTypes";
import {P2P, TEAM} from "../../configs/consts";
import {getUserUID} from "../store/storeBridge";

export function historyMsg(state = {}, action ) {
    switch ( action.type ) {
        case ADD_HISTORY_MSG_BY_REVERSE:
            return addHistoryMsgsByReverse( state, action.msgs, action.userUID );
        case SET_HISTORY_MSG:
            return {
                ...state,
                [ action.sid ]: action.msgs.reverse()
            }
        default:
            return state
    }
}


function addHistoryMsgsByReverse( oldMsgs, msgs, userUID ) {
    let msgCache = Object.assign( {}, oldMsgs );
    var item,
        user;
        // if (msgs[0].scene === "team") {
        //     user = msgs[0].to;
        //     msgCache["team-" + user] = [];
        // }else {
        //     user = (msgs[0].from === userUID ? msgs[0].to : msgs[0].from);
        //     msgCache["p2p-" + user] = [];
        // }
    for ( let i = 0; i < msgs.length; i++ ) {
        if ( msgs[ i ].scene === TEAM ) {
            user = msgs[ i ].to;
            if ( !msgCache[ TEAM + "-" + user ] ) {
                msgCache[ TEAM + "-" + user ] = [];
            }
            msgCache[ TEAM + "-" + user ].unshift( msgs[ i ] );
        } else {
            user = ( msgs[i].from == userUID ? msgs[i].to : msgs[ i ].from );
            if (!msgCache[ P2P + "-" + user ]) {
                msgCache[ P2P + "-" + user ] = [];
            }
            msgCache[ P2P + "-" + user ].unshift(msgs[i]);
        }
    }
    return msgCache;
}