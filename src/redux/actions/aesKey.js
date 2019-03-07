import {SET_AES_KEY} from "../actionTypes";
/**
 * 设置aes key
*/
export function setAesKey( aesKey ) {
    return {
        type: SET_AES_KEY,
        aesKey
    }
}