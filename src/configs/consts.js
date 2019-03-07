/**
 * 业务常量
 */
export const P2P = 'p2p';
export const TEAM = 'team';
export const GEO = 'geo';
export const TIP = 'tip';
export const ARTICLE = 'article';
export const REPOST = 'repost';
export const CUSTOM = 'custom';
export const TEXT = 'text';
export const VIDEO = 'video';
export const AUDIO = 'audio';
export const FILE = 'file';
export const IMAGE = 'image';
//msg type
export const CHARTLET = 3;//贴图
export const RED_ENVELOPE = 6;
export const CARD = 9;//名片
export const MERGE_MSG = 5;
export const TRANSFER = 7;
export const VIDEO_GIF = 8;
export const MOMENT = 10;
export const GAME_SHARE = 11;
export const FROWARD = 9;
export const FORWARD_MSG_TYPE = {
    TEXT: 0,
    VIDEO: 4,
    IMAGE: 1,
    FILE: 2,
    AUDIO: 3
}
export const TYPES = {
    [GEO]: "地理位置",
    [RED_ENVELOPE]: "红包",
    [TRANSFER]: "转账",
    [MOMENT]: "秘圈",
    [GAME_SHARE]: "游戏分享",
    [CARD]: "名片",
    [ARTICLE]: "文章",
    [REPOST]: "转发消息",
};

export const MT_EMOJI = 'mt_emoji';
//贴图表情
export const PINUP = 'pinup';
export const MALE_NUM = 1;
export const FEMALE_NUM = 0;
export const SEX_MALE = '男';
export const SEX_FEMALE = '女';

//chat menu types
export const MENU_SESSION = 'MENU_SESSION';
export const MENU_FRIEND = 'MENU_FRIEND';
export const MENU_TEAM = 'MENU_TEAM';
export const MENU_ADD = 'MENU_ADD';

//switchs
export const SOUND = 'SOUND';
export const DESKTOP = 'DESKTOP';
export const MEMBER_LSIT = 'MEMBER_LSIT';
export const SESSION_MENU = 'SESSION_MENU';
export const CHATTING_HISTORY = 'CHATTING_HISTORY';

export const SENDER_ME = 'me';
export const SENDER_YOU = 'you';

export const MODAL_ALERT = 'alert';
export const MODAL_CONFIRM = 'confirm';
export const MODAL_PROMPT = 'prompt';

export const REPORT_MOMENT = 'moment';//举报

export const HISTORY_REPALCE = 'replace';
export const HISTORY_PUSH = 'push';

export const INPUT_TEXT = 'text';
export const INPUT_PASSWORD = 'password';

//举报类型
export const REPORT_TYPE_MOMENT = 2;
export const REPORT_TYPE_USER = 3;

export const userType = {
    friend: "friend",
    focus: 'focus',
    follower: 'follower'
};

export const MSGIDS = {
    SUCCESS: "200",//成功
    ERROR: "400",//操作失败
    AUTH_ERROR: "401",//身份认证失败
    PARAMS_ERROR: "402",//参数错误
    ACCESS_ERROR: "403",//没有权限
    VERSION_LOW_ERROR: "404",//版本过低
    BLOCK_PAY: "405",//支付功能被封禁
    DATA_EXISTED: "601",//数据已存在
    DATA_NOT_FOUND: "602",//数据不存在
    EXECUTED: "603",//已被执行过
    LESS_THAN_MIN: "604",//低于最小限制
    MORE_THAN_MAX: "605",//超过最大限制
    MSG_CODE_ERROR: "606",//短信验证码错误
    NUMBER_NOT_ENOUGH: "607",//数量不足
    CONDITION_NOT_MATCH: "608",//不满足条件
    PASSWORD_ERROR: "609",//密码错误
    KEY_EXPIRED: "902",//key expired
    QRCODE_NOT_BEEN_READ: "901",//二维码未被扫描
}