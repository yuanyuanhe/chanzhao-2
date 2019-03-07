import { requestWithToken, requestWithTokenAndCanCancel} from "./index";
import { getUrl} from "../redux/store/storeBridge";
import {sendGetUsersSquareDataRequest} from "./square";
/**
 * 关注的人
*/
export function getFocusedUsers( uid, page ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getFocusedUsers" ) + "/" + uid + "/" + page,
        type: "get"
    } )
}

export function sendAddFocusedUserRequest( uid ) {
    return requestWithToken( {
        url: getUrl( "focusNewUser" ),
        type: "post",
        data: {
            uid
        }
    } )
}

export function sendUserIsFocusedRequest( uid ) {
    return sendGetUsersSquareDataRequest( uid ).then( ( { msgId, is_follower, message } ) => {
        return {
            msgId,
            focused: is_follower,
            message
        }
    } );
}

export function sendDeleteFocusedUserRequest( uid ) {
    return requestWithToken( {
        url: getUrl( "unSubscribeUser" ) + "/" + uid,
        type: "delete"
    } )
}