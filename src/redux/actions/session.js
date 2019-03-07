import { SET_SESSION, SET_CURRENT_SESSION_ID } from "../actionTypes";

//sessions
export function setSessionList(sessions ) {
    return {
        type: SET_SESSION,
        sessions
    }
}

export function setCurrentSessionId( sessionId ) {
    return {
        type: SET_CURRENT_SESSION_ID,
        sessionId
    }
}