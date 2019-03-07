import {ADD_SYS_NOTIFICATION, CLEAN_SYS_NOTIFICATION} from "../actionTypes";

export function addSysNotification(msg ) {
    return {
        type: ADD_SYS_NOTIFICATION,
        msg
    }
}

export function cleanSysNotification() {
    return {
        type: CLEAN_SYS_NOTIFICATION
    }
}