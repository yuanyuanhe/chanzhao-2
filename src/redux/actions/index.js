/**
 * redux action 生成方法
*/
export { setFriendlist, updateFriendAlias } from "./friends";
export { setBlackList } from "./blacklist";
export { updatePersonList } from "./people";//setPersonList,
export { setSessionList,setCurrentSessionId } from "./session";
export { setTeamMembers } from "./teamMembers";
export { addMsg,addMsgs,setMsg,backoutMsg } from "./msg";
export { setUserUID } from './userUID';
export { setTeamlist } from './teamMap';
export { setServerToken } from './token';
export { setAesKey } from './aesKey';
export { setServerConfig } from './serverConfig';
export { setMtsdk } from './mtsdk';
//initFocusedMoments,initHotMoments,initUserCenterMoments,initRecommandMomenrs,initCollectedMoments,deleteCollectionMoment,
export {  focusUserInMoment, cancelFocusUserInMoment,initMoments,addMoments, collectMomentInMomentProvider, cancelCollectMomentInMomentProvider, hideMomentInMomentProvider, upMomentInProvider, cancelUpMomentInProvider,deleteMomentInMomentProvider, increaseCommentInProvider,decreaseCommentInProvider } from './moments';
export { setFocusedUsers, deleteFocusedUser } from './focusedUsers';//setFocusedUsersPage, addFocusedUser,
// export { setFans, setFansPage } from './fans';
export { setImageRoot } from './imageRoot';
export { toggleSwitchs,offSwitch,onSwitch } from './switchs';
export { setSearchWords } from './searchWords';
export { setSearchResult } from './searchResult';
export { setFriendTabId, setTeamTabId } from './tabId';
export { addHistoryMsgsByReverse } from './historyMsg';//, setHistoryMsg
export { addFriendshipApply, allowFriendshipApply } from './friendshipApplies';
export { addSysNotification, cleanSysNotification } from './sysNotification';