import {isDev} from "../util";
import {GROUNP_OX} from "./iconNames";
/**
 * 本地配置
*/
let Config = {
    defaultTeamAvatar: GROUNP_OX,
    keyLen: 16,
    requestStateCode: {
        success: "200"
    },
    yunxin: {
        url: 'https://app.netease.im'
    },
    gaode: {
        url: "https://webapi.amap.com/maps",
        key: "0bc9a80586a664ba833f590ff8aec0d2",
        plugin: "AMap.Geocoder",
        version: "1.3"
    },
    oss: {
        bucket: "mituresprd",
        region: "oss-cn-hangzhou"
    },
    urls: {
        login: () => `login`,//u
        getConfig: () => `config/app`,//u pre: app/config
        getOssKey: () => `resource/oss`,//t
        getMeTrust: () => `vip/user/trust/me_trust`,//t
        getTrustMe: () => `vip/user/trust/trust_me`,//t
        getLocation: () => `location`,//u
        alarm: () => `vip/safe/alarm`,//手机响铃 t u
        sendMessage: () => `vip/safe/SMS`,//发送短信给紧急联系人 t u
        safe: () => `vip/safe`,// t u
        checkCHPwd: () => `pay/passwd/check`,//t
        sendNewFsItem: () => `friends/new_moment`,//t u
        //    label
        createLabel: () => `label`,//post t u
        getAllLabels: () => `label`,//get t u
        deleteLabel: () => `label/name`,//delete t u
        deleteLabelMembers: () => `label/name/members`,// t u
        updateLabel: () => `label/name`,// t u
        addLabelMember: () => `label/name/members`,// t u
        uploadDebugInfo: () => `debug`,//u
        getWhitelist: () => `vip/user/trust/me_trust`,//
        signOut: () => `signOut`,//u
        getSTS: () => `config/sts`,//u pre: resource/sts
        //    square
        getFans: () => `squares/follower`,//get u
        getUserCenterData: ( { uid = "" } ) => `squares/profile/${uid}`,//get
        focusNewUser: () => `squares/focus_user`,//post u
        getFocusedUsers: () => `squares/focus_user`,//get u
        unSubscribeUser: () => `squares/focus_user`,//delete u
        reportMoment: () => `squares/report`,//post
        dislikeMoment: () => `squares/dislike`,//post
        getSquareMomentByUidAndMid: () => `squares/moment/friend`,//get
        getSquareMoments: () => `squares/moment/detail`,//get
        transportSquareMoment: () => `squares/reprint`,//post
        hideSquareMoment: ( { mid = '' } ) => `squares/hide/${mid}`,//post u
        getRecommendSquareMoments: () => `squares/recommand/moments`,//get u
        deleteSquareMoment: () => `squares/moment`,//delete u
        releaseNewSquareMoment: () => `squares/moment`,//post u
        getSquareFocusedMoments: () => `squares/moments`,//get u
        getSquareHotMoments: () => `squares/hot/moments`,//get u
        getUserCenterMoments: () => `squares/moments`,//get u
        cancelThumbsupSquareMoment: ( { mid = '' } ) => `squares/thumbsup/${mid}`,//delete u
        thumbsupSquareMoment: ( { mid = '' } ) => `squares/thumbsup/${mid}`,//post u
        deleteSquareMomentComment: ( { mid = '', cid = '' } ) => `squares/comment/${mid}/${cid}`,//delete u
        addSquareMomentComment: ( { mid = '' } ) => `squares/comment/${mid}`,//post
        getLabelsUnderTopic: () => `squares/topics/labels`,//get
        searchSquareMoments: () => `squares/search`,//get
        insertTopic: () => `squares/interest_topics`,//post
        initTopics: () => `squares/interest_topics`,//put
        getAllTopics: () => `squares/topics`,//get
        getUserInterestingTopic: () => `squares/interest_topics`,//get
        deleteCollection: () => `squares/collection`,//delete u
        addCollection: () => `squares/collection`,//post u
        getCollections: () => `squares/collection`,//get u
        getSquareState: () => `squares/stat`,//get
        getQueryKey: () => `qrcode/key`,//u
        circleQuery: () => `qrcode/polling`,//u
        feedBack: () => `feed_back/report`,//u
        getFeedBackTypes: () => `feed_back/report/types`,// u
        getHotCommentsByPage: ( { mid = "" } ) => `squares/comments/${mid}`,
        getSubCommentOfHotCommentByPage: ( { mid = "", cid = "" } ) => `squares/comments/${mid}/${cid}`,
        thumbsupComment: ( { mid = "", cid = "" } ) => `squares/comment/thumbsup/${mid}/${cid}`,
        cancelThumbsupComment: ( { mid = "", cid = "" } ) => `squares/comment/thumbsup/${mid}/${cid}`,
        // user relationship
        getUserById: ( { uid } ) => `user/profile/${uid}`,
        getUsers: () => `user/users/profile`,
        findUsers: () => `user/find`,//模糊查找 t u
        getAllFriends: () => `im/friend`,
        changeFriendRemark: () => `im/friend`,//u
        friendAction: ( { fid = "" } ) => `im/friend/${fid}`,//post u
        deleteFriend: () => `im/friend`,//u
        toggleFriendMute: ( { fids } ) => `im/friend/mute/${JSON.stringify( fids )}`,
        checkFriendMute: ( { fid } ) => `im/friend/mute/${fid}`,
        // team
        getAllTeams: () => `im/team/join/teamsInfo`,
        createTeam: () => `im/team`,//u post
        addTeamMember: ( { tid = "" } ) => `im/team/${tid}/members`,
        kickTeamMember: ( { tid = "" } ) => `im/team/${tid}/members`,
        leaveTeam: ( { tid = "" } ) => `im/team/member/${tid}`,//u
        dismissTeam: ( { tid = "" } ) => `im/team/${tid}`,//u
        updateTeamInfo: ( { tid = "" } ) => `im/team/${tid}`,
        updateMemberAlias: ( { tid = "" } ) => `im/team/${tid}/member/nick`,
        toggleTeamMute: ( { tid = "" } ) => `im/team/${tid}/member/notify`,
    },
    defaultLocation: "不显示位置",
};


// const subDomain = isDev() ? 'devapi' : 'api';
const subDomain = 'devapi';
// const subDomain = 'api';
const root = `https://${subDomain}.mitures.com/`;
export default { root, ...Config };



let getAbsoluteUrl = func => qs => {
    return root + func(qs)
};
let proxyHandler = {
    get: (target, name) => {
        return name in target ? getAbsoluteUrl(target[name]) : "";
    }
};
let urlsProxy = new Proxy( Config.urls, proxyHandler);
export let urls = urlsProxy;
// console.log( '🍎' ); // of course 🍎
// console.log( 'root: ', root ); //  root:  https://devapi.mitures.com/
// console.log( 'from urls: ', urls.createTeam() ); // from urls:  im/team
// console.log( 'from proxy: ', urlsProxy.createTeam() ); // from proxy:  https://devapi.mitures.com/im/team


