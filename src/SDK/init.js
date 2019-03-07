import { NeteaseBridge } from "./NeteaseBridge";
import {setMtsdk} from "../redux/actions";
import {store} from "../redux/store";
import { IMBridge } from "./IMBridge";

// const axios = window.axios;
/**
 * configs: { appKey, account, token }
*/
export function initSDK( configs, connectedCallback ) {
    // store.dispatch( setMtsdk( new IMBridge( configs, connectedCallback ).imsdk ) );
    // 必要的初始化流程
    let shared = new IMBridge( configs, connectedCallback );
    store.dispatch( setMtsdk( IMBridge ) );
}