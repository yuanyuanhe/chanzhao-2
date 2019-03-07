import React, { Component } from 'react';
import "./index.css";
import { ICON_TALK_EXPRESSION } from '../../../../../../../configs/iconNames';
import {initEmoji} from "../../../../../../../util/emoji";
const iconSrc = ICON_TALK_EXPRESSION.convertIconSrc();
class EmojiSelectot extends Component{
    constructor( props ) {
        super( props );
        this.triggerEmojiSelecter = this.triggerEmojiSelecter.bind( this );
        this.initEmojiTab = this.initEmojiTab.bind( this );
        this.initState = false;
    }

    initEmojiTab( node ) {
        if ( !node ) {
            return;
        }
        this.$emojiTab = initEmoji( node, this.props.selectedEmoji );
        this.$emojiTab._$hide();
    }

    triggerEmojiSelecter( e ) {
        if ( this.initState ) {
            this.$emojiTab._$hide();
        } else {
            this.$emojiTab._$show();
        }
        this.initState = !this.initState;
    }

    render () {
        return (
            <div className={'session-input-menu-item'}>
                <div className="emoji-tab-area" id="emoji-tab-area" ref={ this.initEmojiTab }></div>
                <img src={iconSrc} alt="表情" title="选择表情" onClick={this.triggerEmojiSelecter} />
            </div>
        )
    }
}

export default EmojiSelectot;
