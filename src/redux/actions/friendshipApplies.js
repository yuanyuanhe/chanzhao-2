import {ADD_FRIENDSHIP_APPLY, ALLOW_FRIENDSHIP_APPLY} from "../actionTypes";

export function addFriendshipApply( apply ) {
    return {
        type: ADD_FRIENDSHIP_APPLY,
        apply
    }
}

export function allowFriendshipApply( uid ) {
    return {
        type: ALLOW_FRIENDSHIP_APPLY,
        uid
    }
}