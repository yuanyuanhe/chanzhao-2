import { requestWithToken} from "./index";
import { getUrl} from "../redux/store/storeBridge";
import { urls } from "../configs/localConfig";

export function sendSearchUserRequest( keyWord ) {
    return requestWithToken( {
        url: getUrl( 'findUsers' ) + "/" + keyWord,
        type: "get"
    } )
}

export function sendGetUserProfileRequest( uid ) {
    return requestWithToken( {
        url: urls.getUserById( { uid } ),
        type: 'get'
    } )
}

export function sendGetUsersRequest( uids ) {
    return requestWithToken( {
        url: urls.getUsers(),
        type: 'get',
        data: {
            uids: JSON.stringify( uids )
        }
    } );
}