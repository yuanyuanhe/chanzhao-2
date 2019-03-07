import {ADD_SYS_NOTIFICATION, CLEAN_SYS_NOTIFICATION} from "../actionTypes";

export function sysNotification(state = [], action ) {
    let cache = [];
    switch ( action.type ) {
        case ADD_SYS_NOTIFICATION:
            cache = state.slice(0);
            cache.unshift( action.msg );
            return cache;
        case CLEAN_SYS_NOTIFICATION:
            return [];
        default:
            return state;
    }
}