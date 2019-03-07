import {
    OFF_MEMBER_LIST_SWITCH,
    TOGGLE_DESKTOP_NOTE_SWITCH,
    TOGGLE_SOUND_NOTE_SWITCH,
    TOGGLE_MEMBER_LIST_SWITCH,
    TOGGLE_SESSION_MENU_SWITCH,
    OFF_SESSION_MENU_SWITCH,
    SHOW_CHATTING_HISTORY,
    HIDE_CHATTING_HISTORY
} from "../actionTypes";
import {
    SOUND,
    DESKTOP,
    MEMBER_LSIT,
    SESSION_MENU,
    CHATTING_HISTORY
} from '../../configs/consts';

export function toggleSwitchs( type ) {
    switch ( type ) {
        case SOUND:
            return {
                type: TOGGLE_SOUND_NOTE_SWITCH
            };
        case DESKTOP:
            return {
                type: TOGGLE_DESKTOP_NOTE_SWITCH
            };
        case MEMBER_LSIT:
            return {
                type: TOGGLE_MEMBER_LIST_SWITCH
        }
        case SESSION_MENU:
            return {
                type: TOGGLE_SESSION_MENU_SWITCH
            }
        default:
            return {
                type: ""
            }
    }
}

export function onSwitch( type, param = { sid: "" } ) {
    let { sid } = param;
    switch ( type ) {
        case CHATTING_HISTORY:
            return {
                type: SHOW_CHATTING_HISTORY,
                sid
            }
        default:
            return {
                type: ""
            }
    }
}

export function offSwitch( type, param={ sid: "" } ) {
    let { sid } = param;
    switch ( type ) {
        case MEMBER_LSIT:
            return {
                type: OFF_MEMBER_LIST_SWITCH
            }
        case SESSION_MENU:
            return {
                type: OFF_SESSION_MENU_SWITCH
            }
        case CHATTING_HISTORY:
            return {
                type: HIDE_CHATTING_HISTORY,
                sid
            }
        default:
            return{
                type: ""
            }
    }
}