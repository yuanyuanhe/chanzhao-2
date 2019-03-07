import {SET_MTSDK} from "../actionTypes";

export function setMtsdk( mtsdk ) {
    return {
        type: SET_MTSDK,
        mtsdk
    }

}