import React, { Component } from 'react';
import "./index.css";
import { TIP_MSG } from '../../../../configs/TIP_TEXTS';
import { ICON_PALYING_BIG } from '../../../../configs/iconNames';
class MomentVideo extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            playVideo: false
        }
    }

    /**
     * 隐藏预览图遮罩层，同时播放该视频
    */
    playVideo = () => {
        this.setState( {
            playVideo: true
        } );
        !!this.videoNode && this.videoNode.play();
    }

    getVideo = ( node ) => {
        this.videoNode = node;
    }

    loadHandler ( e ) {
        let target = e.target,
            className = target.className;
        if ( target.width <= target.height ) {
            className += " thumbnail-vertical-middle";
        } else {
            className += " thumbnail-horizontal-middle";
        }
        target.className = className;
    }

    /**
     * 视频秘圈组件
     * data: {Array} 视频组件路径数据
     *     [
     *        0: {String} 视频链接，相对路径,
     *        1: {String} 视频预览图链接，相对路径
     *     ]
    */
    render () {
        let { data:[ videoSrc, thumbnailSrc ] } = this.props;
        let { playVideo } = this.state;
        videoSrc = videoSrc.checkSrcHost();
        thumbnailSrc = thumbnailSrc.convertSrcWebp();
        return (
            <div className={"moment-item-video"}>
                {
                    playVideo ? false :
                    <div className="miv-thumbnail-container">
                        <img onLoad={this.loadHandler} className={'miv-thumbnail'} src={thumbnailSrc} alt="" title="" />
                        <img onClick={this.playVideo} className={'miv-play'} src={ICON_PALYING_BIG.convertIconSrc()} alt="" title="播放" />
                    </div>
                }
                <div className="miv-video-container">
                    <video ref={this.getVideo} src={ playVideo ? videoSrc: undefined } autoPlay={playVideo} controls={playVideo}>
                        {TIP_MSG}
                    </video>
                </div>
            </div>
        )
    }
}

export default MomentVideo;
