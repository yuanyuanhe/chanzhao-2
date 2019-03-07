import {SET_SEARCH_RESULT} from "../actionTypes";

export function setSearchResult( users ) {
    return {
        type: SET_SEARCH_RESULT,
        users
    }
}