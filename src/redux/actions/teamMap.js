import {SET_TEAM_MAP, UPDATE_TEAM } from "../actionTypes";
export function setTeamlist( teamlist ) {
    return {
        type: SET_TEAM_MAP,
        teamlist
    }
}

export function updateTeam( teamId, team ) {
    return {
        type: UPDATE_TEAM,
        teamId,
        team
    }
}