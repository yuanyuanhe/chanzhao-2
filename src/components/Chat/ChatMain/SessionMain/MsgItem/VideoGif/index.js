import React, { Component } from 'react';
import "./index.css";
import ImageMsg from "../ImageMsg";
import VideoMsg from "../VideoMsg";
import NotSupportMsg from "../NotSupportMsg";
import {ARTICLE, REPOST, TYPES} from "../../../../../../configs/consts";
import {checkJSON} from "../../../../../../util";
class VideoGif extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * gif转换的视频消息，自动播放并循环播放隐藏控制menu模拟gif图片
     * loadHandler: {Function} 加载完后处理方法
     * src: {String} video src
     * data: {JSON String} msg的content部分，json stringify后的字符串
     *     {
     *         type: {Int} 1: 图片消息; 2: gif转图片; 3: 文章消息;
     *         url: {String} 图片路径或视频路径，相对路径
     *     }
    */
    render () {
        let { data, src: videoSrc, loadHandler } = this.props;
        var TranspondData = checkJSON( data );
        if ( !!TranspondData && TranspondData.type == 1 ) {
            return <ImageMsg loadHandler={loadHandler} src={ TranspondData.url.checkSrcHost() + '?imageView&thumbnail=200x0&quality=85'} />;
        } else if ( !!videoSrc || TranspondData.type == 2 ) {
            let src = videoSrc || data.url,
                reg = /#!/g,
                mp4Reg = /mp4/g;
            if ( reg.test( src ) ) {
                let arr = src.split( reg );
                arr.forEach( v => {
                    if ( mp4Reg.test( v ) ) {
                        src = v;
                    }
                } );
            }
            src = src.checkSrcHost();

            return <div className={"msg-item msg-video-gif"}>
                <video onLoad={loadHandler} src={src} autoPlay={true} loop={true}>
                    <img onLoad={ loadHandler } src={src} alt="" title="" />
                </video>
            </div> ;
        } else if ( TranspondData.type == 3 ) {
            //render article msg
            return <NotSupportMsg type={ TYPES[ ARTICLE ] }/>
        } else {
            return <NotSupportMsg type={ TYPES[ REPOST ] }/>;
        }
    }
}

export default VideoGif;
