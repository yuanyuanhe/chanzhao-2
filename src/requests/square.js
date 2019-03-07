import {requestWithToken} from "./index";
import {getUrl} from "../redux/store/storeBridge";
/**
 * 获取用户广场资料
*/
export function sendGetUsersSquareDataRequest(uid ) {
    return requestWithToken( {
        url: getUrl( 'getUserCenterData', { uid } ),
        type: 'get'
    } );
}