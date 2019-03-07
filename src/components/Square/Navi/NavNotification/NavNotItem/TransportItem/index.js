import React, { Component } from 'react';
import "./index.css";
import {getRepostParams, getUserData, transTime2} from "../../../../../../util";
import {getPersonById} from "../../../../../../redux/store/storeBridge";
import Avatar from '../../../../../generics/Avatar';
import { NAV_NOTICE_SHARE } from '../../../../../../configs/iconNames';
import NotIcon from '../NotIcon';
class TransportItem extends Component{
    constructor( props ) {
        super( props );
        this.iconSrc = NAV_NOTICE_SHARE.convertIconSrc();
    }

    render () {
        let { uid, moment, time } = this.props,
            { avatar, alias } = getUserData( getPersonById( uid ) ),
            { mid, src } = getRepostParams( moment ),
            text = moment.words;
        return (
            <div className={'nav-notice-item clear'}>
                <NotIcon iconSrc={this.iconSrc}/>
                <div className="nav-notice-item-right">
                    <div className="nni-right-line nni-right-header">
                        <Avatar src={avatar} title={alias} classes={['nav-notice-avatar']} />
                        <div className="nni-right-alias auto-omit">{alias}</div>
                        <span className="nni-tip">转发了你</span>
                    </div>
                    <div className="nni-right-line nni-right-text">
                        <span className="nni-text auto-omit">{text}</span>
                    </div>
                    <div className="nni-right-line nni-right-time">{ transTime2(time) }</div>
                    <div className="nni-right-image-wrapper vertical-middle">
                        { !src ? false : <Avatar src={src} alt="" title="" classes={['nni-right-image']} /> }
                    </div>
                </div>
            </div>
        )
    }
}

export default TransportItem;
