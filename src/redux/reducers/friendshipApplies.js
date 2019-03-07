import {ADD_FRIENDSHIP_APPLY, ALLOW_FRIENDSHIP_APPLY} from "../actionTypes";

export function friendshipApplies(state = [], action ) {
    switch ( action.type ) {
        case ADD_FRIENDSHIP_APPLY:
            return [
                action.apply,
                ...state
            ];
        case ALLOW_FRIENDSHIP_APPLY:
            return allowFriendshipApply( state.slice(0), action.uid );
        default:
            return state;
    }
}

function allowFriendshipApply( applies, uid ) {
    applies.forEach( ( { account }, i ) => {
        if ( account == uid ) {
            applies[ i ].allowed = true;
        }
    } );
    return applies;
}

