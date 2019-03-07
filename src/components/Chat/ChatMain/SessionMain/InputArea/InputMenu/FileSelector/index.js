import React, { Component } from 'react';
import "./index.css";
import { ICON_TALK_FOLDER } from '../../../../../../../configs/iconNames';
const iconSrc = ICON_TALK_FOLDER.convertIconSrc();
class FileSelector extends Component{
    constructor( props ) {
        super( props );
        this.clickFileInput = this.clickFileInput.bind( this );
        this.onChange = this.onChange.bind( this );
    }

    onChange( e ) {
        this.props.fileHandler( e.target.files[ 0 ], true );
    }

    clickFileInput() {
        let $input = document.querySelector( '#' + this.props.fileId );
        !!$input? $input.click() : false;
    }

    render () {
        let { fileId } = this.props;
        return (
            <div className={'session-input-menu-item'}>
                <form id={'form-' + fileId} style={ { display:"none" } }>
                    <input type="file" id={fileId} onChange={this.onChange} />
                </form>
                <img src={iconSrc} alt="文件" title="选择文件" onClick={this.clickFileInput} />
            </div>
        )
    }
}

export default FileSelector;
