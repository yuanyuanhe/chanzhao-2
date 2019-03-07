import {requestWithToken} from "./index";
import {getUrl} from "../redux/store/storeBridge";
/**
 * 获取关注的人和粉丝的数量用于确定用户中心的页数
*/
export async function sendGetFocusUserAndFollowerNumRequest( uid ) {
    let data;
    try{
        data = await requestWithToken( {
            url: getUrl( 'getUserCenterData', { uid } ),
            type: "get"
        } );
    } catch ( e ) {
        console.log( "getUserCenterData error: ", e );
        return null;
    }
    let { msgId, followStatistic } = data;
    if ( msgId !== '200' ) {
        return {
            msgId,
            focusUser: 0,
            follower: 0
        }
    }
    let { focusUser = 0, follower = 0 } = followStatistic;
    return {
        msgId,
        focusUser,
        follower
    }
}