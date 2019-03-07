import React, { Component } from 'react';
import "./index.css";
import { BLANK_FANS, BLANK_FRIENNDS_2, BLANK_ATTENTION, BLANK_HOMEPAGE, BLANK_COLLECTION } from '../../../../../configs/iconNames';
class UCEmptyePage extends Component{
    constructor( props ) {
        super( props );
        this.iconData = {

        };
        this.textData = {
            [BLANK_FANS]: "一个...粉丝都没有...",
            [BLANK_FRIENNDS_2]: "一个...好友都没有...",
            [BLANK_ATTENTION]: "没有关注任何人",
            [BLANK_HOMEPAGE]: "OMG,空空...如也...",
            [BLANK_COLLECTION]: "什么...都没有...",
        }
    }

    getDataByType ( type ) {
        switch ( type ) {
            case 'focus':
                return {
                    src: BLANK_ATTENTION.convertIconSrc(),
                    text: this.textData[BLANK_ATTENTION]
                }
            case 'follower':
                return {
                    src: BLANK_FANS.convertIconSrc(),
                    text: this.textData[BLANK_FANS]
                }
            case 'friend':
                return {
                    src: BLANK_FRIENNDS_2.convertIconSrc(),
                    text: this.textData[BLANK_FRIENNDS_2]
                }
            default:
                return null;
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
            <div className={'uc-empty-page'}>
                <img src={ src } alt="" title="" className="uc-empty-page-img" />
                <div className="uc-empty-page-text">{text}</div>
            </div>
        )
    }
}

export default UCEmptyePage;
