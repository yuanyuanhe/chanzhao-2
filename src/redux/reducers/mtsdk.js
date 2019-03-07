import {SET_MTSDK} from "../actionTypes";

export function mtsdk( state = {}, action ) {
    switch ( action.type ) {
        case SET_MTSDK:
            return action.mtsdk;
        default:
            return state;
    }
}