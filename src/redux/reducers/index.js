import { combineReducers } from 'redux';
import {moments} from "./moments";
// import {sdks} from "./sdk";
import {friendlist} from "./friends";
import {blacklist} from "./blacklist";
import {personlist} from "./people";
import {teamMembers} from "./teamMembers";
import {sessions} from "./sessions";
import {userUID} from "./userUID";
import {teamMap} from "./teamMap";
import {currentSessionId} from "./currentSessionId";
import {msgs} from "./msg";
import {serverToken} from "./token";
import {aesKey} from "./aesKey";
import {serverConfig} from "./serverConfig";
import {mtsdk} from "./mtsdk";
import {focusedUsers, focusedUsersPage} from "./focusedUsers";
import {fans, fansPage} from './fans';
import {imageRoot} from "./imageRoot";
import {switchs} from "./switchs";
import { searchWords } from './searchWords';
import { searchResult } from './searchResult';
import { teamTabId, friendTabId } from './tabIds';
import { historyMsg } from './historyMsg';
import { friendshipApplies } from './friendshipApplies';
import { sysNotification } from './sysNotification'
//sdks,
export let reducer = combineReducers({
    moments,
    sysNotification,
    friendlist,
    blacklist,
    personlist,
    teamMembers,
    sessions,
    userUID,
    teamMap,
    currentSessionId,
    msgs,
    historyMsg,
    serverToken,
    aesKey,
    serverConfig,
    mtsdk,
    focusedUsers,
    fans,
    focusedUsersPage,
    fansPage,
    imageRoot,
    switchs,
    searchWords,
    searchResult,
    teamTabId,
    friendTabId,
    friendshipApplies
});
//sdks,
