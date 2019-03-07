import {SET_SEARCH_WORDS} from "../actionTypes";

export function searchWords(state = "", action ) {
    switch ( action.type ) {
        case SET_SEARCH_WORDS:
            return action.words;
        default:
            return state;
    }
}