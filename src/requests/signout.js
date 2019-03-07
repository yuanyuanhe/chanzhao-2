import { requestWithToken} from "./index";
import { getUrl} from "../redux/store/storeBridge";
/**
 * 登出 用于注销token
*/
export function sendSignoutRequest() {
    return requestWithToken( {
        url: getUrl( "signOut" ),
        type: "get"
    } )
}