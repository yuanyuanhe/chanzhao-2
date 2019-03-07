import { SET_SERVER_TOKEN } from "../actionTypes";
export function setServerToken( serverToken ) {
    return {
        type: SET_SERVER_TOKEN,
        serverToken
    }
}