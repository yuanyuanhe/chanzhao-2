import {requestWithToken} from "./index";
import {getUrl} from "../redux/store/storeBridge";

const TYPE_LOGIN = 'login';
const TYPE_PAY = 'pay';
/**
 * 检查登录密码是否正确，用于检测聊天历史记录的查看密码
*/
export function sendCheckCHPasswordRequest( password ) {
    return requestWithToken( {
        url: getUrl( "checkCHPwd" ),
        type: "post",
        data: {
            password,
            type: TYPE_LOGIN
        }
    } )
}