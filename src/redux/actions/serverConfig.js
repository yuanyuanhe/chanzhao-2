import { SET_SERVER_CONFIG } from "../actionTypes";
export function setServerConfig( config ) {
    return {
        type: SET_SERVER_CONFIG,
        config
    }
}