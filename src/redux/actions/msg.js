import {ADD_MSG, BACKOUT_MSG} from "../actionTypes";
import {ADD_MSGS} from "../actionTypes";
import {SET_MSG} from "../actionTypes";
import {getUserUID} from "../store/storeBridge";

export function addMsg( msg ) {
    let userUID = getUserUID();
    return {
        type: ADD_MSG,
        msg,
        userUID
    }
}

export function addMsgs( msgs ) {
    let userUID = getUserUID();
    return {
        type: ADD_MSGS,
        msgs,
        userUID
    }
}

export function setMsg( sid, cid, msg ) {
    let userUID = getUserUID();
    return {
        type: SET_MSG,
        sid,
        cid,
        msg,
        userUID
    }
}

export function backoutMsg( sid, cid, msg ) {
    let userUID = getUserUID();
    return {
        type: BACKOUT_MSG,
        sid,
        cid,
        msg,
        userUID
    }
}