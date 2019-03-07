import {SET_SEARCH_RESULT} from "../actionTypes";

export function searchResult( state = [], action ) {
    switch ( action.type ) {
        case SET_SEARCH_RESULT:
            return action.users;
        default:
            return state;
    }
}