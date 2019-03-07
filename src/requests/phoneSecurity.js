import { requestWithToken} from "./index";
import {getUrl} from "../redux/store/storeBridge";
/**
 * 手机安全 主要是手机找回那块
*/
//@return { security: true|false, msgId }
export function sendGetSafeStateRequest() {
    return requestWithToken( {
        url: getUrl( "safe" ),
        type: "get"
    } )
}

//@return { msgId: 605 超过最大限制（一天一次） }
export function sendSendMessageRequest() {
    return requestWithToken( {
        url: getUrl( "sendMessage" ),
        type: "get"
    } );
}

//@return { msgId: 608 不满足条件(手机找回未开启) }
export function sendRaiseAlarmRequest() {
    return requestWithToken( {
        url: getUrl( "alarm" ),
        type: "get"
    } );
}