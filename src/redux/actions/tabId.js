import {SET_TAB_ID_FRIEND,SET_TAB_ID_TEAM} from "../actionTypes";

export function setFriendTabId( fid ) {
    return {
        type: SET_TAB_ID_FRIEND,
        fid
    }
}

export function setTeamTabId( teamId ) {
    return {
        type: SET_TAB_ID_TEAM,
        teamId
    }
}
