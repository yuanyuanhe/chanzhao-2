import {ADD_FOCUSED_USERS, DELETE_FOCUSED_USERS, SET_FOCUSED_USERS} from "../actionTypes";
import {SET_FOCUSED_USERS_PAGE} from "../actionTypes";
import {userIsFocused} from "../store/storeBridge";

/**
 * focusedUsers: {
 *     account: {
 *         [ 0 ]: added users
 *         [pageNum]: [ uids ]
 *     }
 *
 * }
*/

export function focusedUsers(state = {}, action ) {
    let cache,
        len;
    switch ( action.type ) {
        case SET_FOCUSED_USERS:
            cache = state[ action.account ] || []
            return {
                ...state,
                [ action.account ]: {
                    ...cache,
                    [ action.page ] : action.users
                }
            };
        // case ADD_FOCUSED_USERS:
        //     if ( userIsFocused( action.account ) ) {
        //         return state;
        //     }
        //     let accounts = state[ action.account ];
        //     if ( !accounts ) {
        //         accounts = {
        //             0: []
        //         }
        //     }
        //     cache = Object.assign( {}, accounts );
        //     cache[ 0 ].push( action.account );
        //     return {
        //         ...state,
        //         [ action.account ]: cache
        //     };
        case DELETE_FOCUSED_USERS:
            cache = ( state[ action.account ] || [] ).slice( 0 );
            cache = deleteUserFromFocusedUsers( cache, action.deletedUid );
            return {
                ...state,
                [ action.account ]: cache
            }
        default:
            return state;
    }
}

export function focusedUsersPage(state = {}, action ) {

    switch ( action.type ) {
        case SET_FOCUSED_USERS_PAGE:
            return {
                ...state,
                [action.account]: action.page
            }
        default:
            return state;
    }

}

function deleteUserFromFocusedUsers( cache, deletedUid ) {
    if ( !Array.isArray( cache ) || cache.length === 0 ) {
        return [];
    }
    for ( let i = cache.length - 1; i >= 0; --i ) {
        if ( cache[ i ].uid === deletedUid ) {
            cache.splice( i, 1 );
            return cache;
        }
    }
    return cache;
}