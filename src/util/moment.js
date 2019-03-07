import {getPersonById} from "../redux/store/storeBridge";

export function getAccountsInMoments(moments ) {
    if ( !Array.isArray( moments ) ) {
        return [];
    }

    let dLen = moments.length,
        accounts = {};
    //获取所有存在的id的数据=> comments and stars
    for ( let k = 0; k < dLen; ++k ) {
        let moment = moments[k];
        let comments = moment.comments,
            cLen,
            stars = moment.star,
            sLen;
        accounts[ moment.uid ] = true;

        if ( !!comments ) {
            cLen = comments.length;
            for ( let i = 0; i < cLen; ++i ) {
                if ( comments[i].to_user + "" !== "0" ) {
                    accounts[ comments[ i ].to_user ] = true;
                }
                if ( !!comments[ i ].uid ) {
                    accounts[ comments[ i ].uid ] = true;
                }
            }
        }
        if ( !!stars ) {
            sLen = stars.length;
            for ( let j = 0; j < sLen; ++j ) {
                if ( stars[ j ].uid ) {
                    accounts[ stars[ j ].uid ] = true;
                }
            }
        }

        if ( moment.type === 5 ) {
            let transportedMomentData = JSON.parse( moment.res_json );
            if ( transportedMomentData.is_del != 1 ) {
                accounts[ transportedMomentData.uid ] = true;
            }
        }
    }
    let accountArray = [];
    if ( accounts[0] ) {
        delete accounts[0];
    }
    for (let key in accounts) {
        accountArray.push(key);
    }
    return accountArray;
}

export function getRepostParams( { mid, type, words, res_json } ) {
    let src;
    if ( type == 5 ) {
        let data = JSON.parse( res_json );
        let is_del = data.is_del;
        if ( is_del ) {
            return null;
        }
        mid = data.mid;
        res_json = data.res_json;
        words = data.words;
        type = data.type;
    }
    if ( type == 1 ) {//文字
        src = "";
    } else if ( type == 2 ) {//图片
        src = JSON.parse( res_json )[ 0 ];
    } else if( type == 3 ) {//视频
        src = JSON.parse( res_json )[ 1 ];
    } else if ( type == 4 ) {//文章
        src = JSON.parse( res_json ).avatar;
    } else if ( type === 6 ) {//游戏
        src = JSON.parse( res_json ).thumbnail;
    } else {
        src = '';
    }
    return {
        mid,
        text: words,
        src
    }
}