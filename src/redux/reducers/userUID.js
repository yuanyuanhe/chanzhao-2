import {SET_USER_UID} from "../actionTypes";

export function userUID(state = 0, action ) {
    switch ( action.type ) {
        case SET_USER_UID:
            return action.uid;
        default:
            return state;
    }

}