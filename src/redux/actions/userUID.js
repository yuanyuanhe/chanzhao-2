import {SET_USER_UID} from "../actionTypes";

export function setUserUID( uid ) {
    return {
        type: SET_USER_UID,
        uid
    }
}