import React, { Component } from 'react';
import "./index.css";
import { BLANK_HOMEPAGE, BLANK_COLLECTION } from '../../../../configs/iconNames';
class MomentEmptyePage extends Component{
    constructor( props ) {
        super( props );
        this.iconData = {

        };
        this.textData = {
            [BLANK_HOMEPAGE]: "OMG,空空...如也...",
            [BLANK_COLLECTION]: "什么...都没有...",
        }
    }

    getDataByType ( type ) {
        switch ( type ) {
            case 'user':
                return {
                    src: BLANK_HOMEPAGE.convertIconSrc(),
                    text: this.textData[BLANK_HOMEPAGE]
                }
            case 'collect':
                return {
                    src: BLANK_COLLECTION.convertIconSrc(),
                    text: this.textData[BLANK_COLLECTION]
                }
            default:
                return {
                    src: BLANK_HOMEPAGE.convertIconSrc(),
                    text: this.textData[BLANK_HOMEPAGE]
                };
        }
    }

    render () {
        let { type } = this.props,
            data = this.getDataByType( type );
        if ( !data ) {
            return false;
        }
        let { src, text } = data;
        return (
            <div className={'moment-empty-page'}>
                <img src={ src } alt="" title="" className="moment-empty-page-img" />
                <div className="moment-empty-page-text">{text}</div>
            </div>
        )
    }
}

export default MomentEmptyePage;
