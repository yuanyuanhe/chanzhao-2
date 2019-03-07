import { requestWithToken} from "./index";
import {getUrl} from "../redux/store/storeBridge";

/**
 * @type { INT } 2: feed back square moment; 3: feed back user
 * @content { JSON STRING } :
 *     square: { mid, type: report_type_id ?, content: text }
 *     user: { uid, type: report_type_id ?, content: text }
*/
export function sendFeedBackRequest( type, content ) {
    return requestWithToken( {
        url: getUrl( "feedBack" ),
        type: "post",
        data: {
            type,
            content
        }
    } )
}

export function sendGetFeedBackTypesRequest() {
    return requestWithToken( {
        url: getUrl( "getFeedBackTypes" ),
        type: "get"
    } );
}