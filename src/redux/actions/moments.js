import {CANCEL_FOCUS_USER_IN_MOMENT, DELETE_COLLECTED_MOMENTS, DOWN_MOMENT, FOCUS_USER_IN_MOMENT, INIT_COLLECTED_MOMENTS, INIT_FOCUSED_MOMENTS, INIT_HOT_MOMENTS, INIT_RECOMMAND_MOMENTS, INIT_USER_CENTER_MOMENTS, UP_MOMENT, INIT_MOMENTS, ADD_MOMENTS, PROVIDER_COLLECT_MOMENT, PROVIDER_CANCEL_COLLECT_MOMENT, PROVIDER_HIDE_MOMENT, PROVIDER_UP_MOMENT, PROVIDER_CANCEL_UP_MOMENT, PROVIDER_DELETE_MOMENT, PROVIDER_INCREASE_COMMENT, PROVIDER_DECREASE_COMMENT} from "../actionTypes";
import {getUserUID} from "../store/storeBridge";

// export function initFocusedMoments( moments ) {
//     return {
//         type: INIT_FOCUSED_MOMENTS,
//         moments
//     }
// }
// export function initHotMoments( moments ) {
//     return {
//         type: INIT_HOT_MOMENTS,
//         moments
//     }
// }
//
// export function initRecommandMomenrs( moments ) {
//     return {
//         type: INIT_RECOMMAND_MOMENTS,
//         moments
//     }
// }
//
// export function initUserCenterMoments( account, moments ) {
//     return {
//         type: INIT_USER_CENTER_MOMENTS,
//         account,
//         moments
//     }
// }
//
// export function initCollectedMoments( moments ) {
//     return {
//         type: INIT_COLLECTED_MOMENTS,
//         moments
//     }
// }

export function initMoments( momentType, moments ) {
    return {
        type: INIT_MOMENTS,
        momentType,
        moments
    }
}

export function addMoments( momentType, moments ) {
    return {
        type: ADD_MOMENTS,
        momentType,
        moments
    }
}

// export function deleteCollectionMoment( mid ) {
//     return {
//         type: DELETE_COLLECTED_MOMENTS,
//         mid
//     }
// }

// export function thumbUpMoment( momentType, mid, uid ) {
//     return {
//         type: UP_MOMENT,
//         momentType,
//         mid,
//         uid
//     }
// }
//
// export function thumbDownMoment( momentType, mid, uid ) {
//     return {
//         type: DOWN_MOMENT,
//         momentType,
//         mid,
//         uid
//     }
// }
/**
 * 关注某类秘圈中的某个用户，改变此类秘圈中所有该用户发送的秘圈中的关注状态
*/
export function focusUserInMoment( momentType, account ) {
    return {
        type: FOCUS_USER_IN_MOMENT,
        momentType,
        account
    }
}

export function cancelFocusUserInMoment( momentType, account ) {
    return {
        type: CANCEL_FOCUS_USER_IN_MOMENT,
        momentType,
        account
    }
}

export function collectMomentInMomentProvider( mid, momentType, isTransport ) {
    return {
        type: PROVIDER_COLLECT_MOMENT,
        mid, momentType, isTransport
    }
}

export function cancelCollectMomentInMomentProvider( mid, momentType, isTransport ) {
    return {
        type: PROVIDER_CANCEL_COLLECT_MOMENT,
        mid, momentType, isTransport
    }
}

export function deleteMomentInMomentProvider( mid, momentType ) {
    return {
        type: PROVIDER_DELETE_MOMENT,
        mid, momentType
    }
}

export function hideMomentInMomentProvider( mid, momentType ) {
    return {
        type: PROVIDER_HIDE_MOMENT,
        mid, momentType
    }
}

export function upMomentInProvider( mid, momentType ) {
    let userUID = getUserUID();
    return {
        type: PROVIDER_UP_MOMENT,
        mid, momentType, userUID
    }
}

export function cancelUpMomentInProvider( mid, momentType ) {
    let userUID = getUserUID();
    return {
        type: PROVIDER_CANCEL_UP_MOMENT,
        mid, momentType, userUID
    }
}

export function increaseCommentInProvider( mid, momentType ) {
    let userUID = getUserUID();
    return {
        type: PROVIDER_INCREASE_COMMENT,
        mid, momentType, userUID
    }
}
export function decreaseCommentInProvider( mid, momentType ) {
    let userUID = getUserUID();
    return {
        type: PROVIDER_DECREASE_COMMENT,
        mid, momentType, userUID
    }
}