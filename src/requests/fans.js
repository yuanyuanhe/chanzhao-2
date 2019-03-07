import { requestWithToken, requestWithTokenAndCanCancel} from "./index";
import { getUrl } from "../redux/store/storeBridge";

/**
 * 粉丝
*/
export function getFans( uid, page ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getFans" ) + "/" + uid + "/" + page,
        type: "get"
    } )
}