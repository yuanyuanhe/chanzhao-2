import {SET_SERVER_TOKEN} from "../actionTypes";
export function serverToken( state = "", action ) {
    switch ( action.type ) {
        case SET_SERVER_TOKEN:
            return action.serverToken;
        default:
            return state;
    }

}