import { SET_AES_KEY } from "../actionTypes";
export function aesKey( state = "", action ) {
    switch ( action.type ) {
        case SET_AES_KEY:
            return action.aesKey;
        default:
            return state;
    }
}