import {ADD_HISTORY_MSG_BY_REVERSE, SET_HISTORY_MSG} from "../actionTypes";
import {getUserUID} from "../store/storeBridge";
/**
 * 倒序添加聊天记录到redux
 * 倒序是为了方便添加
*/
export function addHistoryMsgsByReverse( msgs ) {
    let userUID = getUserUID();
    return {
        type: ADD_HISTORY_MSG_BY_REVERSE,
        msgs,
        userUID
    }
}
//
// export function setHistoryMsg( sid, msgs ) {
//     let userUID = getUserUID();
//     return {
//         type: SET_HISTORY_MSG,
//         sid, msgs, userUID
//     }
// }