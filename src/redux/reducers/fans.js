import {SET_FANS, SET_FANS_PAGE} from "../actionTypes";

export function fans( state = {}, action ) {
    let cache;
    switch ( action.type ) {
        case SET_FANS:
            cache = ( state[action.account] || [] ).slice(0);
            cache[ action.page ] = action.fans;
            return {
                ...state,
                [action.account]: cache
            }
        default:
            return state;
    }
}

export function fansPage( state = {}, action ) {
    let cache;
    switch ( action.type ) {
        case SET_FANS_PAGE:
            return {
                ...state,
                [ action.account ]: action.page
            }
        default:
            return state;
    }
}