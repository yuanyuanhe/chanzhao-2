import {SET_TEAM_MAP, UPDATE_TEAM} from "../actionTypes";

export function teamMap(state = {}, action ) {
    switch ( action.type ) {
        case SET_TEAM_MAP:
            return {
                ...state,
                ...formatTeamlist(action.teamlist)
            };
        case UPDATE_TEAM:
            return {
                ...state,
                [ action.teamId ]: action.team
            };
        default:
            return state;
    }

}

function formatTeamlist( teamlist ) {
    let teamMap = {};
    if ( !Array.isArray( teamlist ) ) {
        teamMap[ teamlist.teamId ] = teamlist;
        return teamMap;
    }
    let item;
    for ( let i = teamlist.length - 1; i >= 0; --i ) {
        item = teamlist[ i ];
        teamMap[ item.teamId ] = item;
    }
    // console.log( teamMap );
    return teamMap;
}