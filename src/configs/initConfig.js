import {getServerConfig} from "../requests";
import {checkJSON, decryptAES} from "../util";
import {getAesKey} from "../redux/store/storeBridge";
/**
 * 初始化项目配置数据
 * 包括本地配置数据以及从服务器拉取的数据
*/
export function initConfig() {
    return getServerConfig().then( res => {
        let { config, size } = res;
        let aesKey = getAesKey();
        return config = checkJSON( decryptAES( aesKey, config ).slice( 0, size ) );
        // let { yunxin: appKey, oss }  = config;
        // console.log( config );
    } )
}