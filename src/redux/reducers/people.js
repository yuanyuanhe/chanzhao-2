import {SET_PERSON_LIST, UPDATE_PERSON_LIST} from "../actionTypes";

export function personlist(state = {}, action ) {
    switch ( action.type ) {
        case SET_PERSON_LIST:
          return {
              ...formatpersonlist(action.personlist)
          }
        case UPDATE_PERSON_LIST:
          return {
              ...state,
              ...formatpersonlist(action.list)
          }
        default:
            return state;
    }
}

function formatpersonlist( list ) {
    let personlist = [],
        item;
    for ( let i = list.length - 1; i >= 0; --i ) {
        item = list[i];
        if ( !item) {
            continue;
        }
        personlist[item.account] = item;
    }
    return personlist;
}