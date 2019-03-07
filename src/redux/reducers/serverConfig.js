import { SET_SERVER_CONFIG } from "../actionTypes";
export function serverConfig( state = {}, action ) {
    switch ( action.type ) {
        case SET_SERVER_CONFIG:
            return action.config;
        default:
            return state;
    }

}