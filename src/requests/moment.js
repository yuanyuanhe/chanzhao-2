import {getRequestPromise, requestWithToken,requestWithTokenAndCanCancel} from "./index";
import {getUrl, getUserUID} from "../redux/store/storeBridge";
//获取关注的秘圈
export function getFocusedMoments({ lasttime }) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getSquareFocusedMoments" ),
        type: "get",
        data: {
            lasttime,
            type: 1
        }
    } );
}
//获取热门秘圈
export function getHotMoments( { page } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getSquareHotMoments" ),
        type: "get",
        data: {
            page
        }
    } );
}
//获取推荐秘圈
export function getRecommendMoments( { lasttime } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getRecommendSquareMoments" ),
        type: "get",
        data: {
            lasttime
        }
    } );
}
//获取个人主页秘圈
export function getUserCenterMoments( { uid, lasttime } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getUserCenterMoments" ) + "/" + uid,
        type: "get",
        data: {
            lasttime
        }
    } );
}
//获取收藏
export function getCollectedMoments( { page } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getCollections" ) + "/" + page,
        type: "get"
    } );
}
//添加收藏
export function sendAddCollectionRequest( mid ) {
    return requestWithToken( {
        url: getUrl( "addCollection" ),
        type: "post",
        data: {
            mid
        }
    } );
}
//删除收藏
export function sendDeleteCollectionRequest( mid ) {
    return requestWithToken( {
        url: getUrl( "deleteCollection" ) + "/" + mid,
        type: "delete"
    } );
}
//点赞
export function sendThumbUpMomentRequest( mid ) {
    return requestWithToken( {
        url: getUrl( "thumbsupSquareMoment", { mid } ),
        type: "post"
    } );
}
//取消点赞
export function sendCancelThumbUpMomentRequest( mid ) {
    return requestWithToken( {
        url: getUrl( "cancelThumbsupSquareMoment", { mid } ),
        type: "delete"
    } );
}
//隐藏秘圈
export function sendHideMomentRequest( mid ) {
    return requestWithToken( {
        url: getUrl( 'hideSquareMoment', { mid } ),
        type: 'post'
    } )
}

/**
 * 发布秘圈
 *
 * @param type: number 秘圈类型
 * @param res_json: string 资源附件 json string,
 * @param words: string 正文, length <= 2000
 * @param shield_type: number 可见权限设置. 全部可见: 1; 全部不可见: -1; 指定人可见: 2; 指定人不可见: -2.
 * @param shield_array: number[] 可见权限相关用户数组, 如果是部分人(不)可见, 数组长度必须大于 0, 且不能包含自身 && length <= 1000
 * @param allow_repost: number 是否允许转发. 不可转发: 0; 可以转发: 1 && shield_type === 1
 * @param location: string 位置信息, 可选参数, length <= 2000, 目前 web 版不考虑
 * @param topic_id: number 话题 ID, 可选参数
 * @param labels: String[] 标签, 可选参数
 * @param forward_reward_number: number 转发奖励数量, 0 代表没有转发奖励
 * @param forward_reward_type: number 奖励类型. 随机: 1; 定额: 2.
 * @param forward_reward_money: number 转发奖励金额, 0 表示没有奖励
 * @param pay_view_money: number 付费阅读金额, 有效值 > 0 且为两位小数
 * @param password: string 支付密码
 * @returns { object }.  i.e., { msgId: string, moments: object[] }
 *
 * See Also: https://github.com/repooo/mitures-server/blob/dev/server/docs/%E7%A7%98%E5%9C%88%E8%A7%84%E5%88%99%E6%8F%8F%E8%BF%B0.md
 */
export function sendCreateSquareMomentRequest( {
    type = 1, res_json = "", words = "", shield_type = 1, shield_array = [],
    allow_repost = 1, location = " ", topic_id, labels = [],
    forward_reward_number = 0, forward_reward_type = 1,
    forward_reward_money = 0, pay_view_money = 0,
    password
} ) {
    return requestWithToken( {
        url: getUrl( "releaseNewSquareMoment" ),
        type: "post",
        contentType: "application/json",
        data: {
            type, res_json, words, shield_type, shield_array, allow_repost, location,forward_reward_number, forward_reward_type,
    forward_reward_money, pay_view_money,
    password,topic_id, labels
        }
    } )
}
//转发秘圈
export function sendTransportMomentRequest( { mid, words } ) {
    let res_json = JSON.stringify( { mid } );
    return requestWithToken( {
        url: getUrl( "releaseNewSquareMoment" ),
        type: "post",
        contentType: "application/json",
        data: {
            type: 5,
            res_json, words,
            shield_type: 1,
            shield_array: [],
            allow_repost: 1,
            location: " ",
            forward_reward_number: 0,
            forward_reward_type: 0,
            forward_reward_money: 0,
            pay_view_money: 0
        }
    } )
}
//删除秘圈
export function sendDeleteSquareMomentRequest( mid ) {
    return requestWithToken( {
        url: getUrl( "deleteSquareMoment" ) + "/" + mid,
        type: "delete",
    } );
}

//分页获取热评
export function sendGetHotCommentRequest( { mid, page } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getHotCommentsByPage", { mid } ),
        type: "get",
        data: {
            page
        }
    } )
}
//分页获取热评的子评论
export function sendGetSubCommentOfHotCommentRequest( { cid, mid, page } ) {
    return requestWithTokenAndCanCancel( {
        url: getUrl( "getSubCommentOfHotCommentByPage", { mid, cid } ),
        type: "get",
        data: {
            page
        }
    } )
}
//添加评论
export function sendAddCommentRequest( { mid, to_cid = 0, to_user = 0, comment } ) {
    return requestWithToken( {
        url: getUrl( 'addSquareMomentComment', { mid } ),
        type: "post",
        contentType: "application/json",
        data: {
            comment, to_cid, to_user
        }
    } );
}
//删除评论
export function sendDeleteCommentRequest( { mid, cid } ) {
    return requestWithToken( {
        url: getUrl( 'deleteSquareMomentComment', { mid, cid } ),
        type: 'delete'
    } )
}
//点赞评论
export function sendThumbsupCommentRequest( { mid, cid } ) {
    return requestWithToken( {
        url: getUrl( "thumbsupComment", { mid, cid } ),
        type: "post"
    } );
}
//取消点赞评论
export function sendCancelThumbsupCommentRequest( { mid, cid } ) {
    return requestWithToken( {
        url: getUrl( "cancelThumbsupComment", { mid, cid } ),
        type: "delete"
    } );
}
//获取话题
export function sendGetAllTopicsRequest() {
    return requestWithToken( {
        url: getUrl( 'getAllTopics' ),
        type: "get"
    } )
}