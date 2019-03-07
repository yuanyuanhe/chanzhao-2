import qs from 'qs';
import {getServerToken} from "../redux/store/storeBridge";
import {history} from "../index";
import {getModalLocation} from "../components/generics/Modal";
import {MODAL_ALERT} from "../configs/consts";


const axios = window.axios;
export { getServerConfig, getSts, getClient } from "./configs";
export {
    getFocusedMoments,
    getHotMoments,
    getRecommendMoments,
    getUserCenterMoments,
    getCollectedMoments,
    sendAddCollectionRequest,
    sendDeleteCollectionRequest,
    sendCancelThumbUpMomentRequest,
    sendThumbUpMomentRequest,
    sendCreateSquareMomentRequest,
    sendDeleteSquareMomentRequest,
    sendHideMomentRequest,
    sendTransportMomentRequest,
    sendAddCommentRequest,
    sendDeleteCommentRequest,
    sendGetAllTopicsRequest,
    sendGetHotCommentRequest,
    sendGetSubCommentOfHotCommentRequest,
    sendCancelThumbsupCommentRequest,
    sendThumbsupCommentRequest
} from './moment';
export { getFocusedUsers, sendAddFocusedUserRequest,sendDeleteFocusedUserRequest,sendUserIsFocusedRequest } from './focusedUsers';
export { getFans } from './fans';
export { sendGetLocationRequest } from "./location";
export { getQueryKey, accountLogin,queryLogin } from "./login";
export { sendSignoutRequest } from './signout';
export { sendDeleteFriendRequest, sendChangeFriendsRemarkRequest, sendAddFriendRequest, sendPassFriendApplyRequest, sendRejectFriendApplyRequest, getAllFriends } from './friend';
export { sendSearchUserRequest, sendGetUserProfileRequest, sendGetUsersRequest } from './user';
export { sendGetAllLabelsRequest,sendAddLabelRequest,sendAddMemberRequest,sendDeleteLabelRequest,sendDeleteMemberRequest,sendUpdateLabelNameRequest } from './label';
export { sendUploadDebugInfoRequest } from './debug';
export { sendFeedBackRequest, sendGetFeedBackTypesRequest } from './feedBack';
export { sendGetSafeStateRequest, sendRaiseAlarmRequest, sendSendMessageRequest } from './phoneSecurity';
export { sendGetFocusUserAndFollowerNumRequest } from './pageNum';
export { sendGetUsersSquareDataRequest } from './square';
export { sendCheckCHPasswordRequest } from './checkPassword';
export {
    sendLeaveTeamRequest,
    sendDismissTeamRequest,
    sendCreateTeamRequest,
    sendAddTeamMemberRequest,
    sendKickTeamMemberRequest,
    sendUpdateMemberAliasRequest,
    sendUpdateTeamInfoRequest,
    sendGetAllTeamsRequest,
    sendToggleTeamMuteRequest
} from './team';

//base request function
export function getRequestPromise( params, splitRes ) {
    let axiosConfig = getAxiosBaseConfigByParams( params );
    return response( axiosConfig, splitRes );
}
//add token to header
export function requestWithToken( params, splitRes ) {
    params.headers = {
        ...params.headers,
        token: getServerToken(),
        // "server-version": process.env.REACT_APP_SERVER_VERSION,
    }
    return getRequestPromise( params, splitRes );
}

//get a cancelable request
export function requestWithTokenAndCanCancel( params, splitRes ) {
    let cancelSource = getCancelTokenSource();
    if ( !!params.headers ) {
        params.headers = {
            ...params.headers,
            token: getServerToken()
        }
    } else {
        params.headers = {
            token: getServerToken()
        }
    }
    let axiosBaseToken = getAxiosBaseConfigByParams( params );
    axiosBaseToken.cancelToken = cancelSource.token;
    return {
        request: response( axiosBaseToken, splitRes ),
        cancelRequest: () => cancelSource.cancel()
    }
}

function getCancelTokenSource() {
    let cancelToken = axios.CancelToken;
    return cancelToken.source();
}

function filterResponse( data, axiosConfig ) {
    let { msgId } = data;
    if ( msgId === '401' ) {
        history.push( getModalLocation( { type: MODAL_ALERT,  text: "登录验证已过期，请稍候再试！", curLocation: history.location, autoReplace: true } ) );
        // use in Alert component
        // cause type of history props can't be function
        window._token_expired = true;
        setTimeout( () => {
            window.location.reload();
        }, 1500 );
    }
}

function getAxiosBaseConfigByParams( params ) {
    let { url, type, data } = params;
    data = data || {};
    let headers = params.headers || undefined;
    let timeout = params.timeout || 1000 * 20;
    let contentType = params.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
    let axiosConfig = {
        url,
        method: type,
        headers: {
            ...headers,
            "Content-Type": contentType,
        },
        timeout
    };
    if ( type.toLowerCase() === 'get' ) {
        axiosConfig.params = data;
    } else {
        if ( !params.contentType ) {
            axiosConfig.data = qs.stringify( data );
        } else if ( params.contentType === 'application/json' ) {
            axiosConfig.data = data;
        } else {
            axiosConfig.data = qs.stringify( data );
        }
    }
    return axiosConfig;
}

/**
 * 发送请求的方法
*/
function response( axiosConfig, splitRes ) {
    return axios( axiosConfig ).then( res => {
        let { data = {} } = res;
        filterResponse( data, axiosConfig );
        return !splitRes ? data : splitResByMsgId( data );
    } );
}

function splitResByMsgId( data ) {
    let { msgId } = data;
    let res = {};
    let stateCodes = [ "200", "400" ];
    stateCodes.forEach( code => {
        res[ "c" + code ] = ( ( data, callback ) => {
                typeof callback === "function" && callback( data );
                return res;
            } ).bind( null, data );
    } );
    res.otherMsgId = ( ( data, callback ) => {
        typeof callback === "function" && callback( data );
        return res;
    } ).bind( null, data );
    return res;
}