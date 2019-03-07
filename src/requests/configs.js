import {getRequestPromise, requestWithToken} from "./index";
import { getRandomKey } from "../util";
import localConfig from "../configs/localConfig";
import {store} from "../redux/store";
import {setAesKey} from "../redux/actions";
import {getBucket, getImageRoot, getUrl} from "../redux/store/storeBridge";

/**
 * 获取服务端配置文件
*/
export function getServerConfig() {
    let { keyLen } = localConfig;
    let key = getRandomKey( keyLen );
    store.dispatch( setAesKey( key ) );
    let data = {
        local: window.MD5( "" )
    }
    let params = {
        url: getUrl( "getConfig" ),
        type: "get",
        data,
        headers: {
            "x-random": key
        }
    }
    return getRequestPromise( params );
}

/**
 * 获取上传图片的oss client
*/
export async function getClient( types ) {
    let data;
    try {
        data = await getSts( types || [ "images" ] );
    } catch ( e ) {
        console.error( "getSTSError: ", e );
        return false;
    }
    let { msgId, auth } = data;
    if ( msgId !== "200" ) {
        return null;
    }
    let imageRoot = getImageRoot(),
        bucket = getBucket(),
        { AccessPath, AccessKeySecret, AccessKeyId, SecurityToken } = auth;
    imageRoot.slice( -1 ) === '/' && ( imageRoot = imageRoot.slice( 0, -1 ) );
    try {
        let client = new window.OSS.Wrapper( {
            accessKeyId: AccessKeyId,
            accessKeySecret: AccessKeySecret,
            endpoint: imageRoot || "https://cdn.mitures.com",
            cname: true,
            secure: true,
            stsToken: auth.SecurityToken,
            bucket: bucket
        } );
        //sts 提供对应目录的授权
        // const storeAs = "images/" + AccessPath + "/" + MD5( fileName + parseInt( Math.random() * 100000000 ) + "" + Date.now() ) + suffix;
        return {
            client,
            path: AccessPath
        }
    } catch ( e ) {
        console.log( "create client error: ", e );
        return null;
    }

}

/**
 * 获取oss sts
*/
export function getSts( types ) {
    return requestWithToken( {
        url: getUrl( "getSTS" ),
        type: "get",
        data: {
            types: JSON.stringify( types )
        }
    } );
}