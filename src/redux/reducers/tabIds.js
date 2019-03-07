import {SET_TAB_ID_FRIEND, SET_TAB_ID_TEAM} from "../actionTypes";

export function friendTabId(state = "", action ) {
    switch ( action.type ) {
        case SET_TAB_ID_FRIEND:
            return action.fid;
        default:
            return state;
    }
}

export function teamTabId( state = '', action ) {
    switch ( action.type ) {
        case SET_TAB_ID_TEAM:
            return action.teamId;
        default:
            return state;
    }
}