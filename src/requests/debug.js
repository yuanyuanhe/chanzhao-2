import {getUrl, getUserUID} from "../redux/store/storeBridge";
import {getRequestPromise} from "./index";

/**
 * 接口失败时上传debug info
*/
export function sendUploadDebugInfoRequest({ url, data, res, msg } ) {
    let content = "dont have log file";
    let info = JSON.stringify( {
        uid: getUserUID(),
        time: Date.now(),
        uAgent: window.navigator.userAgent,
        data,
        res,
        msg,
        url
    } );
    return getRequestPromise( {
        url: getUrl( "uploadDebugInfo" ),
        type: "post",
        data: {
            type: 0,
            content,
            info
        }
    } );
}