import { getRequestPromise } from "./index";
import {getUrl} from "../redux/store/storeBridge";
/**
 * 登录
*/
//获取轮寻二维码的key
export function getQueryKey() {
    return getRequestPromise( {
        url: getUrl( 'getQueryKey' ),
        type: "get",
    } );
}

export function queryLogin( key ) {
    return getRequestPromise( {
        url: getUrl( "circleQuery" ) + "/" + key,
        type: "post"
    } );
}

export function accountLogin( phone, password ) {
    let data = {
        phone,
        password
    };
    let params = {
        url: getUrl( "login" ),
        data,
        type: "post"
    }
    return getRequestPromise( params );
}