import {SET_FRIEND_LIST, UPDATE_FRIEND_ALIAS} from "../actionTypes";

export function friendlist(state = [], action ) {
    let cache;
    switch ( action.type ) {
        case SET_FRIEND_LIST:
            return [
                ...action.friends
            ];
        case UPDATE_FRIEND_ALIAS:
            cache = state.slice(0);
            updateAlias( cache, action.account, action.alias );
        default:
            return state;
    }
}

function updateAlias( friends, fid, alias ) {
    let item = friends.find( v => {
        return v.account == fid;
    } );
    if ( !!item ) {
        item.alias = alias;
    }
    return friends;
}