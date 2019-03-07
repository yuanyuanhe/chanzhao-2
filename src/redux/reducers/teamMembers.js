import {SET_TEAM_MEMBERS} from "../actionTypes";

export function teamMembers(state = {}, action ) {
    switch ( action.type ) {
        case SET_TEAM_MEMBERS:
        return {
                ...state,
                [ action.teamId ]: action.data
            }
        default:
            return state;
    }
}