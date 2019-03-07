import React, { Component } from 'react';
import "./index.css";
import {MT_EMOJI} from "../../../../../../configs/consts";
import {getImageRoot} from "../../../../../../redux/store/storeBridge";
import {_$escape} from "../../../../../../util";
import VideoGif from "../VideoGif";
class DIYEmojiMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 贴图消息
    */
    render () {
        let { src, chartlet, catalog, loadHandler } = this.props,
            videoReg = /#!/;
        if ( !!src ) {
            if ( videoReg.test( src ) ) {
                let videoUrl = src.split( videoReg )[ 1 ];
                videoUrl = videoUrl.checkSrcHost();
                return <VideoGif src={videoUrl}/>
            } else {
                //兼容老版本写死的url
                src = src.convertSrcWebp();
            }
        } else {
            catalog = _$escape( catalog );
            let chartvar = _$escape( chartlet );
            if ( catalog === MT_EMOJI ) {
                src = getImageRoot() + '/images/' + catalog + '/' + chartvar + '.png';
            }
        }

        return (
            <div className={"msg-item diy-emoji-msg"}>
                <img onLoad={loadHandler} src={src} alt="" title="" />
            </div>
        )
    }
}

export default DIYEmojiMsg;
