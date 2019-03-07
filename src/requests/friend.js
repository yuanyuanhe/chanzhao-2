import { requestWithToken} from "./index";
import { getUrl} from "../redux/store/storeBridge";
import { urls, root } from "../configs/localConfig";
import { FriendActionTypes } from "../SDK/IMBridge";

export function sendDeleteFriendRequest( uid ) {
    return requestWithToken( {
        url: getUrl( "deleteFriend" ) + "/" + uid,
        type: "delete"
    } )
}

export function sendChangeFriendsRemarkRequest( fid, remarks ) {
    return requestWithToken( {
        url: getUrl( "changeFriendRemark" ) + '/' + fid,
        type: "put",
        data: {
            remarks
        }
    } );
}

/**
 * 发送好友相关操作
 * @param {string} fid - 好友 uid
 * @param {FriendActionTypes} type - 操作类型, 1: 申请; 2: 同意; 3: 拒绝;
 * @param {string} [message] - 申请添加好友时的验证信息, 最多 128 字符
 * @param {string} [remarks] - 给对方设置的备注名称, 最多 16 字符
 * @return {*}
 */
export function sendFriendActionRequest( fid, type, message = "", remarks = "" ) {
    let typeMap = {
        [ FriendActionTypes.APPLY ]: 1,
        [ FriendActionTypes.PASS ]: 2,
        [ FriendActionTypes.REJECT ]: 3
    };
    return requestWithToken( {
        url: urls.friendAction( { fid } ),
        type: "post",
        data: {
            type: typeMap[type],
            message,
            remarks,
        }
    } );
}

/**
 * 发送好友申请
 */
export function sendAddFriendRequest( fid, message = "", remarks = "" ) {
    return sendFriendActionRequest( fid, FriendActionTypes.APPLY, message, remarks );
}

/**
 * 通过好友申请
 */
export function sendPassFriendApplyRequest( fid ) {
    return sendFriendActionRequest( fid, FriendActionTypes.PASS );
}

/**
 * 拒绝好友申请
 */
export function sendRejectFriendApplyRequest( fid ) {
    return sendFriendActionRequest( fid, FriendActionTypes.REJECT );
}

/**
 * 获取所有好友列表
 * sex, 0: 女; 1: 男
 * birthday: "yyyy-MM-dd"
 * @return {{friends: {uid: number, remarks: string, name: string, avatar: string, photo_wall: string[], area: string, birthday: string, sex: number, mt_number: string, autograph: string, lv: number}[]}}
 */
export function getAllFriends() {
    return requestWithToken( {
        url: urls.getAllFriends(),
        type: 'get',
    } );
}

/**
 * 设置好友消息免打扰
 * @param {string[]} fids - 相关 uid 数组
 * @param {boolean} isMute - 设置结果
 * @return {{fids: number[]}} - 请求中有失败时, 返回失败的 uid 数组
 */
export function toggleFriendMute( fids, isMute ) {
    let type = isMute ? 'post' : 'delete';
    return requestWithToken( {
        url: urls.toggleFriendMute( { fids } ),
        type,
    } );
}

/**
 * 对方是否被我设为免打扰
 * @param {string} fid
 * @return {{isMuted: boolean}}
 */
export function checkFriendMuteRequest( fid ) {
    return requestWithToken({
        url: urls.checkFriendMute( { fid } ),
        type: 'get'
    })
}
