
//friends
import {SET_FRIEND_LIST, UPDATE_FRIEND_ALIAS} from "../actionTypes";

export function setFriendlist(friends ) {
    return {
        type: SET_FRIEND_LIST,
        friends
    }
}

export function updateFriendAlias( account, alias ) {
    return {
        type: UPDATE_FRIEND_ALIAS,
        account,
        alias
    }
}