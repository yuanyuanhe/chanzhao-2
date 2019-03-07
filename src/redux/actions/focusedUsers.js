import {ADD_FOCUSED_USERS, DELETE_FOCUSED_USERS, SET_FOCUSED_USERS, SET_FOCUSED_USERS_PAGE} from "../actionTypes";
/**
 * 设置关注的人
*/
export function setFocusedUsers( account, users, page ) {
    return {
        type: SET_FOCUSED_USERS,
        account,
        users,
        page
    }
}

//
// export function addFocusedUser( account, addedUser ) {
//     return {
//         type: ADD_FOCUSED_USERS,
//         account,
//         addedUser
//     }
// }
/**
 * 删除关注的人
*/
export function deleteFocusedUser( account, deletedUid ) {
    return {
        type: DELETE_FOCUSED_USERS,
        account,
        deletedUid
    }
}

// export function setFocusedUsersPage( account, page ) {
//     return {
//         type: SET_FOCUSED_USERS_PAGE,
//         account,
//         page
//     }
// }