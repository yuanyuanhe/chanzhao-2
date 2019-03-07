import { requestWithToken} from "./index";
import { getUrl} from "../redux/store/storeBridge";

//秘圈权限分组用标签不是话题下的那个秘圈标签
export function sendGetAllLabelsRequest() {
    return requestWithToken( {
        url: getUrl( "getAllLabels" ),
        type: "get",
        contentType: "application/json"
    } )
}

export function sendDeleteMemberRequest( name, members ) {
    members.forEach( (v,i) => members[i] = parseInt(v) );
    return requestWithToken( {
        url: getUrl( "deleteLabelMembers" ),
        contentType: "application/json",
        type: "delete",
        data: {
            name,
            members
        }
    } )
}

export function sendDeleteLabelRequest( name ) {
    return requestWithToken( {
        url: getUrl( "deleteLabel" ),
        contentType: "application/json",
        type: "delete",
        data: {
            name
        }
    } )
}

export function sendAddMemberRequest( name, members ) {
    members.forEach( (v,i) => members[i] = parseInt(v) )
    return requestWithToken( {
        url: getUrl( "addLabelMember" ),
        contentType: "application/json",
        type: "post",
        data: {
            name,
            members
        }
    } )
}

export function sendAddLabelRequest( name, members ) {
    members.forEach( (v,i) => members[i] = parseInt(v) )
    return requestWithToken( {
        url: getUrl( "createLabel" ),
        contentType: "application/json",
        type: "post",
        data: {
            name,
            members
        }
    } )
}

export function sendUpdateLabelNameRequest( oldname, newname ) {
    return requestWithToken( {
        url: getUrl( "updateLabel" ),
        contentType: "application/json",
        type: "put",
        data: {
            oldname,
            newname
        }
    } )
}