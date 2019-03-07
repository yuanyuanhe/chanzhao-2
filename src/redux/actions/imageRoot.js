import {SET_IMAGE_ROOT} from "../actionTypes";

export function setImageRoot( path ) {
    return {
        type: SET_IMAGE_ROOT,
        path
    }
}