import {SET_BLACK_LIST} from "../actionTypes";

export function blacklist(state = [], action ) {
    switch ( action.type ) {
        case SET_BLACK_LIST:
          return [
              ...action.blacklist
          ]
        default:
            return state;
    }
}