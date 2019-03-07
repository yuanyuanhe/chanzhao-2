import {SET_IMAGE_ROOT} from "../actionTypes";

export function imageRoot(state = 'https://cdn.mitures.com/', action ) {
    let path;
    switch ( action.type ) {
        case SET_IMAGE_ROOT:
             path = action.path;
             if ( path.slice(-1) !== '/' ) {
                 path += '/';
             }
             return path;
        default:
            return state;
    }

}