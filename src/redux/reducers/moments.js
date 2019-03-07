import {
    ADD_MOMENTS,
    CANCEL_FOCUS_USER_IN_MOMENT,
    DELETE_COLLECTED_MOMENTS,
    DOWN_MOMENT, FOCUS_USER_IN_MOMENT,
    INIT_COLLECTED_MOMENTS,
    INIT_FOCUSED_MOMENTS,
    INIT_HOT_MOMENTS, INIT_MOMENTS,
    INIT_RECOMMAND_MOMENTS,
    INIT_USER_CENTER_MOMENTS, PROVIDER_COLLECT_MOMENT, PROVIDER_CANCEL_COLLECT_MOMENT, PROVIDER_CANCEL_UP_MOMENT, PROVIDER_DECREASE_COMMENT, PROVIDER_DELETE_MOMENT, PROVIDER_HIDE_MOMENT, PROVIDER_INCREASE_COMMENT, PROVIDER_UP_MOMENT,
    UP_MOMENT
} from "../actionTypes";
import {deepCopy} from "../../util";
import { MomentFilters } from "../../components/Square/MomentProvider";

const focused = MomentFilters.focused;
const hot = MomentFilters.hot;
const recommend = MomentFilters.recommend;
const collection = MomentFilters.collection;


export function moments(state = {}, action) {
    let cache,
        moments;
    switch (action.type) {
        case INIT_FOCUSED_MOMENTS:
            return {
                ...state,
                [ focused ]: action.moments
            }
        case INIT_HOT_MOMENTS:
            return {
                ...state,
                [ hot ]: action.moments
            }
        case INIT_RECOMMAND_MOMENTS:
            return {
                ...state,
                [ recommend ]: action.moments
            }
        case INIT_USER_CENTER_MOMENTS:
            return {
                ...state,
                [ action.account ]: action.moments
            }
        case INIT_COLLECTED_MOMENTS:
            return {
                ...state,
                [ collection ]: action.moments
            };
        case INIT_MOMENTS:
            return {
                ...state,
                [ action.momentType ]: action.moments
            };
        case ADD_MOMENTS:
            return {
                ...state,
                [ action.momentType ]: [ ...( state[ action.momentType ] || [] ), ...( action.moments || [] ) ]
            };
        case DELETE_COLLECTED_MOMENTS:
            moments = ( state[ collection ] || [] ).slice( 0 );
            moments = deleteMomentByMid( moments, action.mid );
            return {
                ...state,
                [ collection ]: moments
            }
        // case UP_MOMENT:
        //     moments = deepCopy( state[ action.momentType ] || [] );
        //     moments = upMoment( moments, action.mid, action.uid );
        //     return {
        //         ...state,
        //         [ action.momentType ]: moments
        //     }
        // case DOWN_MOMENT:
        //     moments = deepCopy( state[ action.momentType ] || [] );
        //     moments = downMoment( moments, action.mid, action.uid )
        //     return {
        //         ...state,
        //         [ action.momentType ]: moments
        //     }
        case FOCUS_USER_IN_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = focusUserInMoment( moments, action.account );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case CANCEL_FOCUS_USER_IN_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = cancelFocusUserInMoment( moments, action.account );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_COLLECT_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = collectMomentInProvider( moments, action.mid, action.isTransport );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_CANCEL_COLLECT_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = cancelCollectMomentInProvider( moments, action.mid, action.isTransport );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_HIDE_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = hideMomentInProvider( moments, action.mid );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_UP_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = upMomentInProvider( moments, action.mid, action.userUID );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_INCREASE_COMMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = increaseCommentInProvider( moments, action.mid, action.userUID );
            return {
                ...state,
                [ action.momentType ]: moments
            }
        case PROVIDER_DECREASE_COMMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = decreaseCommentInProvider( moments, action.mid, action.userUID );
            return {
                ...state,
                [ action.momentType ]: moments
            }
        case PROVIDER_CANCEL_UP_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = cancelUpMomentInProvider( moments, action.mid, action.userUID );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        case PROVIDER_DELETE_MOMENT:
            moments = deepCopy( state[ action.momentType ] || [] );
            moments = deleteMomentInProvider( moments, action.mid );
            return {
                ...state,
                [ action.momentType ]: moments
            };
        default:
            return state
    }
}

function upMomentInProvider( moments, mid, userUID ) {
    let item = moments.find( v => v.mid === mid );
    if ( !item ) {
        return moments;
    } else {
        item.is_thumbsup = true;
        item.thumbsup_number += 1;
    }
    return moments;
}

function cancelUpMomentInProvider( moments, mid, userUID ) {
    let item = moments.find( v => v.mid === mid );
    if ( !item ) {
        return moments;
    } else {
        item.is_thumbsup = false;
        item.thumbsup_number -= 1;
    }
    return moments;
}

function increaseCommentInProvider( moments, mid, userUID ) {
    let item = moments.find( v => v.mid === mid );
    if ( !item ) {
        return moments;
    } else {
        item.comment_number += 1;
    }
    return moments;
}

function decreaseCommentInProvider( moments, mid, userUID ) {
    let item = moments.find( v => v.mid === mid );
    if ( !item ) {
        return moments;
    } else {
        item.comment_number -= 1;
    }
    return moments;
}
function deleteMomentInProvider( moments, mid ) {
    for ( let i = moments.length - 1; i >= 0; --i ) {
        if ( moments[i].mid === mid ) {
            moments.splice( i, 1 );
            return moments;
        }
    }
    return moments;
}

function hideMomentInProvider( moments, mid ) {
    for ( let i = moments.length - 1; i >= 0; --i ) {
        if ( moments[i].mid === mid ) {
            moments.splice( i, 1 );
            return moments;
        }
    }
    return moments;
}

function collectMomentInProvider( moments, mid, isTransport ) {
    moments.forEach( ( v, i ) => {
        if ( v.type != 5 ) {
            v.mid === mid && ( moments[i].is_collect = true );
        } else {
            JSON.parse( v.res_json ).mid === mid && ( moments[i].is_collect = true );
        }
    } );
    return moments;
}

function cancelCollectMomentInProvider( moments, mid, isTransport ) {
   moments.forEach( ( v, i ) => {
        if ( v.type != 5 ) {
            v.mid === mid && ( moments[i].is_collect = false );
        } else {
            JSON.parse( v.res_json ).mid === mid && ( moments[i].is_collect = false );
        }
    } );
    return moments;
}

function focusUserInMoment( moments, account ) {
    moments.forEach( ( { uid, is_follower }, i ) => {
        if ( account == uid ) {
            moments[ i ].is_follower = true;
        }
    } );
    return moments;
}

function cancelFocusUserInMoment( moments, account ) {
    moments.forEach( ( { uid, is_follower }, i ) => {
        if ( account == uid ) {
            moments[ i ].is_follower = false;
        }
    } );
    return moments;
}

// function upMoment( moments, mid, uid ) {
//     let moment;
//     for ( let i = moments.length - 1; i >= 0; --i ) {
//         if ( moments[ i ].mid === mid ) {
//             moment = moments[ i ];
//             break;
//         }
//     }
//     if ( !moment ) {
//         return moments;
//     }
//     moment.is_thumbsup = true;
//     moment.thumbsup_number += 1;
//     return moments;
// }
//
// function downMoment( moments, mid, uid ) {
//     let moment;
//     for ( let i = moments.length - 1; i >= 0; --i ) {
//         if ( moments[ i ].mid === mid ) {
//             moment = moments[ i ];
//             break;
//         }
//     }
//     if ( !moment ) {
//         return moments;
//     }
//     moment.is_thumbsup = false;
//     moment.thumbsup_number -= 1;
//     return moments;
// }

function deleteMomentByMid( moments, mid ) {
    if ( !Array.isArray( moments ) || moments.length === 0 ) {
        return [];
    }
    for ( let i = moments.length - 1; i >= 0; --i ) {
        if ( moments[ i ].mid === mid ) {
            moments.splice( i, 1 );
            return moments;
        }
    }
    return moments;
}