import React, { Component } from 'react';
import "./index.css";
class VideoMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 视频消息
     * src: 视频链接， 相对路径
    */
    render () {
        let { src } = this.props;
        return (
            <div className={"msg-item video-msg"}>
                <video src={src.checkSrcHost()} controls={true}>
                    您的浏览器不支持视频播放，为了更好地体验秘图网页版，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。
                </video>
            </div>
        )
    }
}

export default VideoMsg;
