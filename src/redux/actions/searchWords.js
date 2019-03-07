import {SET_SEARCH_WORDS} from "../actionTypes";

export function setSearchWords( words ) {
    return {
        type: SET_SEARCH_WORDS,
        words
    }
}