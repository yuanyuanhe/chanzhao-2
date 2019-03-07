import { SET_TEAM_MEMBERS } from '../actionTypes'
//teams
export function setTeamMembers( teamId, data ) {
    return {
        type: SET_TEAM_MEMBERS,
        teamId,
        data
    }
}