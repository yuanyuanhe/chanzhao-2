import {HIDE_CHATTING_HISTORY, OFF_MEMBER_LIST_SWITCH, OFF_SESSION_MENU_SWITCH, SHOW_CHATTING_HISTORY, TOGGLE_DESKTOP_NOTE_SWITCH, TOGGLE_MEMBER_LIST_SWITCH, TOGGLE_SESSION_MENU_SWITCH, TOGGLE_SOUND_NOTE_SWITCH} from "../actionTypes";
import {SOUND, DESKTOP, MEMBER_LSIT, SESSION_MENU, CHATTING_HISTORY} from '../../configs/consts';
let initSwitchs = {
    [SOUND]: true,
    [DESKTOP]: true,
    [MEMBER_LSIT]: false,
    [SESSION_MENU]: false,
    [CHATTING_HISTORY]: {}
}

export function switchs(state = initSwitchs, action ) {
    switch( action.type ) {
        case TOGGLE_SOUND_NOTE_SWITCH:
            return {
                ...state,
                [SOUND]: !state[SOUND]
            };
        case TOGGLE_DESKTOP_NOTE_SWITCH:
            return {
                ...state,
                [DESKTOP]: !state[DESKTOP]
            }
        case TOGGLE_MEMBER_LIST_SWITCH:
            return {
                ...state,
                [MEMBER_LSIT]: !state[MEMBER_LSIT]
            }
        case TOGGLE_SESSION_MENU_SWITCH:
            return {
                ...state,
                [SESSION_MENU]: !state[SESSION_MENU]
            }
        case OFF_MEMBER_LIST_SWITCH:
            return {
                ...state,
                [MEMBER_LSIT]: false
            }
        case OFF_SESSION_MENU_SWITCH:
            return {
                ...state,
                [SESSION_MENU]: false
            }
        case SHOW_CHATTING_HISTORY:
            return {
                ...state,
                [CHATTING_HISTORY]: {
                    ...state[CHATTING_HISTORY],
                    [action.sid]: true
                }
            }
        case HIDE_CHATTING_HISTORY:
            return {
                ...state,
                [CHATTING_HISTORY]: {
                    ...state[CHATTING_HISTORY],
                    [action.sid]: false
                }
            }
        default:
            return state;
    }
}