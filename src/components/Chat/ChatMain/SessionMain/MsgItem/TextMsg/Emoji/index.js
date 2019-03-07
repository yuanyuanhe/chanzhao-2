import React, { Component } from 'react';
import "./index.css";
import {getImageRoot} from "../../../../../../../redux/store/storeBridge";
import {emoji} from "../../../../../../../SDK/emoji";
class Emoji extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * emoji组件
    */
    render () {
        let { src, text } = this.props;
        return (
            <img className={'emoji'} src={src} alt={text} title={text} />
        )
    }
}

export default Emoji;
