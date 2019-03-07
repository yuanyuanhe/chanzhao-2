import React, { Component } from 'react';
import "./index.css";
import EmojiSelectot from './EmojiSelectot';
import FileSelector from './FileSelector';
class InputMenu extends Component{
    constructor( props ) {
        super( props );
    }

    render () {
        return (
            <div className={'session-input-menu'}>
                <EmojiSelectot selectedEmoji={this.props.selectedEmoji}/>
                <FileSelector fileId={this.props.fileId} fileHandler={this.props.fileHandler}/>
            </div>
        )
    }
}

export default InputMenu;
