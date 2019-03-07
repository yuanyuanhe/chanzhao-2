import React, { Component } from 'react';
import "./index.css";
import Emoji from './Emoji';
import { emoji} from "../../../../../../SDK/emoji";
import {getImagePath} from "../../../../../../util/emoji";
class TextMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 将文本中emoji转换的特定格式文本('[发怒]')显示为emoji图片
    */
    buildEmoji (text) {
        let imageRoot = getImagePath();
        let re = /\[([^\]\[]*)\]/g;
        let spilter = /\[[^\]\[]*\]/g;
        let matches = text.match(re) || [];
        let texts = text.split( spilter ),
            emojis = [];
        for (let j = 0, len = matches.length; j < len; ++j) {
            if ( emoji[ matches[ j ] ] ) {
                let text = matches[ j ],
                    url = imageRoot + 'emoji/' + emoji[ matches[j]].file;
                emojis.push( <Emoji src={url} text={text}/> )
                // text = text.replace(matches[j], '<img class="emoji" src={url} />');
            }
        }
        if ( emojis.length === 0 ) {
            return text
        }

        return texts.map( ( v, i ) => {
            return <span key={i}>
                { v }
                { emojis[i] || false }
                </span>
        } );
    }

    /**
     * 纯文本消息，包含emoji
    */
    render () {
        let { text } = this.props;
        let main = this.buildEmoji( text );
        //链接 表情
        return (
            <div className={"msg-item text-msg"}>
                { main }
            </div>
        )
    }
}

export default TextMsg;
