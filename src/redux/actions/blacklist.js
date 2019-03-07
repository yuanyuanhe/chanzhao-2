
//black list
import {SET_BLACK_LIST} from "../actionTypes";

export function setBlackList(blacklist ) {
    return {
        type: SET_BLACK_LIST,
        blacklist
    }
}
