//person list
import {SET_PERSON_LIST,UPDATE_PERSON_LIST} from "../actionTypes";

// export function setPersonList(personlist ) {
//     return {
//         type: SET_PERSON_LIST,
//         personlist
//     }
// }

export function updatePersonList( list ) {
    if ( !Array.isArray( list ) ) {
        list = [ list ];
    }
    return {
        type: UPDATE_PERSON_LIST,
        list
    }
}