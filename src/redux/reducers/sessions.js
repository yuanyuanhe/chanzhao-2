import {SET_SESSION} from "../actionTypes";

export function sessions(state = [], action ) {
    switch ( action.type ) {
        case SET_SESSION:
            return [
                ...action.sessions
            ]
        default:
            return state;
    }
}