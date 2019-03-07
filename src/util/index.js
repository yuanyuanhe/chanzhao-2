import './jquery';
import {store} from "../redux/store";
import {getFriendAlias, getPersonById, getUserUID, isFriend} from "../redux/store/storeBridge";
import pinyinUtil from "../SDK/pinyinUtil";

export { transTime, transTime2 } from './date';
export { transNotification, getMemberNick, getNick, getMessage } from './msg';
export { getAccountsInMoments, getRepostParams } from './moment';
export { startChatWith } from './session';
export { getUserCenterRouter } from './router'

let keys = [];
for( let key = 'a'.charCodeAt(0); key <= 'z'.charCodeAt(0); ++key ) {
    keys.push( String.fromCharCode( key ) );
}

export function deepCopy( obj ) {
    return JSON.parse( JSON.stringify( obj ) );
}

export function getPinYin(str) {
    return pinyinUtil.getPinyin(str, ' ', false, false).split(" ").join("");
}

export function getFriendNameList( friends ) {
    let namelist = [];
    friends.forEach( ( { account } ) => {
        let { alias } = getUserData( getPersonById( account ) );
        namelist.push( {
            name: getPinYin( alias ).toLowerCase(),
            account
        } );
    } );
    return namelist;
}

export function getTeamNameList( teamMap ) {
    let namelist = [];
    for( let key in teamMap ) {
        let { valid, name, teamId } = teamMap[key];
        if ( !!valid ) {
            namelist.push( {
                name: getPinYin( name ).toLowerCase(),
                account: teamId
            } );
        }
    }
    return namelist;
}

/**
 * @param list {Array}: [ item{ Object: name, account } ]
*/
export function getNameGroups( list ) {
    let map = [];
    keys.forEach( v => {
        map.push( {
            key: v,
            accounts: []
        } );
    } )
    map.push( {
        key: "others",
        accounts: []
    } );
    let otherKey = map.length - 1;
    list.forEach( ( { name, account } ) => {
        let pinyin = getPinYin( name )[0];
        ( map.find( item => {
            return item.key === pinyin;
        } ) || map[ otherKey ] ).accounts.push( account );
    } );
    return map;
}

export function convertWebp( src ) {
    src = checkHost( src );
    if ( window.supportWebp ) {
        if ( !( /webp/i.test( src ) ) && !/\?x\-oss\-process/.test( src ) ) {
            return src + "?x-oss-process=image/format,webp";
        } else {
            return src;
        }
    } else {
        if ( ( /webp/i.test( src ) ) && !/\?x\-oss\-process/.test( src ) ) {
            return src + "?x-oss-process=image/format,jpg";
        } else {
            return src;
        }
    }
    // return src;
}

/*
 * 检查浏览器是否支持 webp, 如果不支持用osse转换成  jpg
 */
export function convertSrcWebp() {
    //https://mituresdev.oss-cn-hangzhou.aliyuncs.com/images/18434b7755914acfb86abb41575143f2/687285130.webp?x-oss-process=image/format,jpg
    let src = this;
    src = src.checkSrcHost();
    if ( window.supportWebp ) {
        if ( !( /webp/i.test( src ) ) && !/\?x\-oss\-process/.test( src ) ) {
            return src + "?x-oss-process=image/format,webp";
        } else {
            return src;
        }
    } else {
        if ( ( /webp/i.test( src ) ) && !/\?x\-oss\-process/.test( src ) ) {
            return src + "?x-oss-process=image/format,jpg";
        } else {
            return src;
        }
    }
}

const iconPath = 'https://cdn.mitures.com/web/assets_v2/img/';
/*
 * icon 专用, 把 const 里的icon文件名转换成 oss 绝对路径
 */
export function convertIconSrc() {
    let src = this;
    return ( iconPath + src.replace( /"/g, "" ) );
}

/*
 * 检查 host，用于秘圈只有相对路径的
 */
export function checkSrcHost() {
    let src = this;
    if ( !src ) {
        return src;
    }
    if ( src[ 0 ] === "/" ) {
        src = src.slice( 1 );
    }
    let { imageRoot } = store.getState();
    if ( !/http/.test( src ) ) {
        src = imageRoot + src;
        return src;
    }
    if ( /http:\/\//.test( src ) ) {
        return src.replace( "http:", "https:" );
    }
    let regDevHZ = /https?:\/\/mituresdev\.oss-cn-hangzhou\.aliyuncs\.com\//gi,
        regPrdHZ = /https?:\/\/mituresprd\.oss-cn-hangzhou\.aliyuncs\.com\//gi;
    if ( regDevHZ.test( src ) ) {
        src = src.replace( regDevHZ, imageRoot );
    }
    if ( regPrdHZ.test( src ) ) {
        src = src.replace( regPrdHZ, imageRoot );
    }
    return src;
}

export function checkHost( src ) {
    if ( !src ) {
        return src;
    }
    if ( src[ 0 ] === "/" ) {
        src = src.slice( 1 );
    }
    if ( !/http/.test( src ) ) {
        let { imageRoot } = store.getState();
        src = imageRoot + src;
        return src;
    }
    if ( /http:\/\//.test( src ) ) {
        return src.replace( "http:", "https:" );
    }
    return src;
}

export function checkWebp() {
    var hasWebP = (function(feature) {
        var images = {
            basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
            lossless: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
        };

        return new Promise( ( resolve, reject ) => {
            window.$( "<img>" ).on( "load", function() {
                if ( this.width === 2 && this.height === 1 ) {
                    resolve(123);
                } else {
                    reject();
                }
            }).on("error", function() {
                reject();
            }).attr("src", images[feature || "basic"]);
        } );
    })();
    return hasWebP;
}

export function checkJSON( msg ) {
    if ( !msg ) {
        return false;
    }
    var data,
        flag = true;
    if( typeof msg === "string" ) {
        try {
            data = JSON.parse( msg );
        } catch( e ) {
            if ( typeof DEBUG !== "undefined" ) {
                console.error( "parse msg Error: ", msg );
            }
            flag = false;
        }
    } else {
        data = msg;
    }
    if ( !flag ) {
        return false;
    }
    return data;
}

export function decryptAES( key, miwen ) {
    let CryptoJS = window.CryptoJS,
        MD5 = window.MD5;
    let realKey = MD5( key ).slice( 8, 24 );
    realKey = CryptoJS.enc.Utf8.parse( realKey )
    var ss = CryptoJS.enc.Hex.parse( miwen )
    var sss = CryptoJS.enc.Base64.stringify( ss )
    var mingwen = CryptoJS.AES.decrypt( sss, realKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
    }).toString( CryptoJS.enc.Utf8 );
    return mingwen;
}

export function getRandomKey( num ) {
    let array = [],
        aNum = "a".charCodeAt( 0 ),
        ANum = "A".charCodeAt( 0 );
    for ( let i = 0; i < 26; ++i ) {
        if ( i < 10 ) {
            array.push( i );
        }
        array.push( String.fromCharCode( aNum + i ) );
        array.push( String.fromCharCode( ANum + i ) );
    }
    let len = array.length,
        key = "";
    for ( let i = 0; i < num; ++i ) {
        key += array[ getRandomNum( len ) ];
    }
    return key;
    function getRandomNum( range ) {
        return parseInt( Math.random() * range, 10 );
    }
}

export function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

export function sliceName(name, len) {
    if(typeof name !== 'string' && typeof name !== 'number'){
        return "未知用户";
    }
    if(name.length <= len){
        return  name ;
    }else {
        //call params apply array
        return  String.prototype.slice.call(name, 0, len) + "..." ;
    }
}

export function getUserData(data) {
    return data || {};
}

/**
 * 上层业务所使用的格式化过后的 用户数据模型
 * @typedef {Object} Person
 * @property {NumberLike} account
 * @property {string} avatar
 * @property {string} name
 * @property {string} area
 * @property {string} sex
 * @property {string} mt_number
 * @property {string} phone - 目前好像未使用
 * @property {string} autograph
 * @property {string} lv
 * @property {string} birthday
 * @property {number} age
 * @property {string} alias
 */

/**
 * Enum for gender of perosn.
 * @readonly
 * @enum {string}
 */
const Gender = {
    male: '男',
    female: '女',
    unknown: 'unknown'
};

/**
 *
 * @param {number} sex
 * @returns {Gender}
 */
function formatGenderFromServer( sex ) {
    return sex == 1 ? Gender.male : Gender.female;
}

/**
 * 格式化用户数据模型
 * @param data
 * @return {{}}
 */
export function formatUserData( data ) {
    if ( !data ) {
        return {};
    }
    // 用过 data.custom 判断数据源为 NIM 还是 Server
    if ( data.custom ) {
        return formatUserFromNIM( data );
    } else {
        return formatUserFromServer( data );
    }
}

/*
服务器回传的数据样例
{
    "uid": 777,
    "name": "帅气boy",
    "avatar": "images/avatar.webp",
    "photo_wall": ["images/1.webp","images/2.webp"],
    "area": "上海",
    "sex": 1, //0:女, 1:男
    "mt_number": "mt2134",
    "autograph": "纵有疾风起，人生不言弃",
    "lv": 1,
    "birthday": "2001-01-01",
    "remarks": "😂哈'\"哈我的备注",
    "friend_count": 87 //好友数（仅自己查看自己资料）
}
 */
function formatUserFromServer( data ) {
    let user = { ...data }; // 有部分冗余存储, 无伤大雅
        // alias;
    user.account = data.uid + "";
    user.avatar = convertWebp( data.avatar );
    user.sex = formatGenderFromServer( data.sex );
    user.lv = (data.lv > 0 ? "" : "非") + "会员";
    user.age = !!data.birthday ? new Date().getFullYear() - data.birthday.split( '-' )[ 0 ] : 0;
    user.alias = !!data.remarks ? data.remarks : data.name;
    // isFriend( data.uid ) && ( alias = getFriendAlias( data.uid ) );
    // user.alias = !!alias ? alias : data.name;
    return user;
}

/**
 * 从 NIM custom 字段格式化用户数据模型
 * 不忍直视
 * @param data
 * @returns {object}
 */
function formatUserFromNIM( data ) {
    let obj = {};
    obj.account = data.account;
    if(data.custom){
        var personMsg = JSON.parse(data.custom);
        obj.avatar = personMsg.heading ? personMsg.heading : personMsg.avatar;
        obj.name = personMsg.name || data.nick || data.account || "";
        obj.area = personMsg.area || "";
        obj.sex = formatGenderFromServer( personMsg.sex );
        obj.mt_number = personMsg.mt_number || "";
        obj.phone = personMsg.phone || "";
        obj.autograph = personMsg.autograph || "";
        if ( !personMsg.lv ) {
            obj.lv = "非会员";
        } else {
            if ( personMsg.lv > 0 ) {
                obj.lv = "会员";
            } else {
                obj.lv = "非会员";
            }
        }
        obj.birthday = personMsg.birthday || "";
        if ( !obj.birthday ) {
            obj.age = 0;
        } else {
            obj.age = ( new Date() ).getFullYear() - obj.birthday.split( '-' )[0];
        }
    } else {
        obj.avatar = data.avatar || "";
        obj.name = !!data.nick ? data.nick : obj.account;
        obj.area = "中国";
        obj.sex = data.gender == "male" ? "男" : "女";
        obj.mt_number = "";
        obj.phone = "";
        obj.autograph = "";
        obj.lv = "非会员";
        obj.birthday = "";
        obj.age = 0;
    }

    if ( isFriend( obj.account ) ) {
        var alias = getFriendAlias( obj.account );
        obj.alias = !!alias ? alias : obj.name;
    } else {
        obj.alias = obj.name;
    }
    obj.avatar = convertWebp( obj.avatar );
    return obj;
}

export function getPageNum( total, numEvPage ) {
    if ( total === 0 ) {
        return 1;
    }
    if ( total % numEvPage === 0 ) {
        return total / numEvPage
    } else {
        return parseInt( total / numEvPage ) + 1;
    }
}

export function getMsgProfileByLastMsg( lastMsg ) {
    let text;
    if ( !lastMsg ) {
        return "[暂无消息]";
    }
    if ( lastMsg.type === 'text' ) {
        return lastMsg.text;
    }
    if( lastMsg.type === 'custom' ){//贴图和红包都是custom
        let content = checkJSON( lastMsg.content );
        if( !content ) {
            text = "[自定义消息]";
        } else if ( !!content.type && +content.type === 6 || !!content.ope || content.ope === 0 || !!content.msgId && content.msgId === "0200" ){
            text = "[红包]";
        } else if ( !!content.type && content.type === 5 ) {
            text = "[转发消息]"
        } else if ( !!content.type && content.type === 9 ) {
            text = "[名片]"
        } else if ( !!content.type && content.type === 3 ) {
            text = "[贴图]";
        } else if ( !!content.type && content.type === 7 ) {
            text = "[转账消息]";
        } else if ( !!content.type && content.type === 10 ) {
            text = "[秘圈消息]";
        } else if ( !!content.type && content.type === 11 ) {
            text = "[游戏分享消息]";
        } else if ( !!content.type && content.type === 8 ) {
            if ( content.data ) {
                let transpondData = checkJSON( content.data );
                if ( transpondData.type == 1 ) {
                    text = "[图片]";
                } else if ( transpondData.type == 2 ) {
                    text = "[视频]";
                } else if ( transpondData.type == 3 ) {
                    text = "[文章]";
                } else {
                    text = "[转发消息]";
                }
            } else {
                text = "[转发消息]";
            }
        } else {
            text = "[自定义消息]";
        }
    } else if ( lastMsg.type === 'image' ) {
        text = "[图片]";
    } else if ( lastMsg.type === 'file' ) {
        text = "[文件]";
    } else if ( lastMsg.type === 'notification' ) {
        if ( lastMsg.attach.type === "dismissTeam" ) {
            text = '[群被解散]';
        } else {
            text = "[通知]";
        }
    } else if ( lastMsg.type === "geo" ) {
        text = "[位置]"
    } else if ( lastMsg.type === 'tip' ) {
        text = lastMsg.tip;
    } else if ( lastMsg.type === 'audio' ) {
        text = "[音频消息]";
    } else if ( lastMsg.type === 'video' ) {
        text = "[视频消息]"
    } else{
        text = "";
    }
    return text;
}

export let _$encode = function (_map, _content) {
    _content = '' + _content;
    if (!_map || !_content) {
        return _content || '';
    }
    return _content.replace(_map.r, function ($1) {
        let _result = _map[!_map.i ? $1.toLowerCase() : $1];
        return _result != null ? _result : $1;
    });
};
export let _$escape = (function () {
    var _reg = /<br\/?>$/,
        _map = {
            r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            ' ': '&nbsp;',
            '"': '&quot;',
            "'": '&#39;',
            '\n': '<br/>',
            '\r': ''
        };
    return function (_content) {
        _content = _$encode(_map, _content);
        return _content.replace(_reg, '<br/><br/>');
    };
})();

export function resetForm( id ) {
    let $form = document.querySelector( '#form-' + id );
    !!$form ? $form.reset(): false;
}

/* 判断当前环境 */
export function isDev() {
    // create-react-app 构建的 react 应用, NODE_ENV 分别对应为
    // start: 'development'
    // test: 'test'
    // build: 'production'
    // 此处未避免测试时意外情况, 判断条件为 非生产环境
    return process.env.NODE_ENV !== 'production';
}

export function isNetease() {
    return process.env.REACT_APP_IM_SDK === 'netease';
}

/**
 * Get scene and account by sid which is assembled for business by Mitures.
 * @param sid
 * @returns {{scene: string, account: string}}
 */
export function getSceneAndAccountBySID( sid ) {
    let [ scene, account ] = sid.split( "-" );
    return { scene, account }
}

export function valueForKeyOfObj( obj, keyPath ) {
    return obj[keyPath];
}

/**
 * Return the index of object which value of option.key is equal to option.value in given array if exsit, otherwise -1.
 * @param array searched array
 * @param keyPath
 * @param value
 * @returns {number}
 */
export function findObjIndexInArray( array, { keyPath = "id", value } ) {
    array = array || [];
    let indexResult = -1;
    array.some( ( element, index ) => {
        if ( valueForKeyOfObj( element, keyPath ) === value ) {
            indexResult = index;
            return true;
        }
    } );
    return indexResult;
}

export function findObjInArray( array, option ) {
    const index = findObjIndexInArray( array, option );
    return index === -1 ? null : array[ index ];
}

export function sortObjArray( array, { sortPath, desc } ) {
    const factor = desc ? -1 : 1;
    array.sort( ( lhs, rhs ) => {
        const result = lhs[ sortPath ] <= rhs[ sortPath ] ? -1 : 1;
        return result * factor;
    } );
}

export function mergeObjArray( olds, news, { keyPath = "id", sortPath = keyPath, notsort = false, desc = false } = {} ) {
    olds = olds || [];
    if ( !news ) { return olds; }
    Array.isArray( news ) || ( news = [ news ] );
    if ( !news.length ) { return olds; }

    let index;
    olds = olds.slice( 0 );
    news.forEach( obj => {
        index = findObjIndexInArray( olds, {
            keyPath,
            value: valueForKeyOfObj( obj, keyPath )
        } );
        index !== -1 ? olds[ index ] = { ...olds[ index ], ...obj } : olds.push( obj );
    } );
    notsort || sortObjArray( olds, { sortPath, desc } );
    return olds;
}

export function cutObjArray( olds, invalids, { keyPath = "id" } = {} ) {
    if ( !olds ) { return olds; }
    if ( !invalids ) { return olds; }
    Array.isArray( invalids ) || ( invalids = [ invalids ] );
    if ( !invalids.length ) { return olds; }

    let index;
    olds = olds.slice( 0 );
    invalids.forEach( invalid => {
        if ( !invalid ) {
            return;
        }
        index = findObjIndexInArray( olds, {
            keyPath,
            value: valueForKeyOfObj( invalid, keyPath )
        } );
        index !== -1 && olds.splice( index, 1 );
    } );
    return olds;
}
