import {CEmojiEngine, emojiList, pinupList} from "../SDK/emoji";
import {getImageRoot} from "../redux/store/storeBridge";

export function getImagePath() {
    return getImageRoot().replace( "dev", "" ) + "web/assests/img/";
}

export function initEmoji( $node, callback ) {
    let emojiConfig = {
        emojiList,
        pinupList,
        width: 500,
        height: 300,
        'imgpath': getImagePath(),
        callback
    }
    return new CEmojiEngine( $node, emojiConfig )
}