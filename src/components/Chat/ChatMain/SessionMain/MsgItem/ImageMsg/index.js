import React, { Component } from 'react';
import "./index.css";
import $ from 'jquery'
import 'lightgallery';
import 'lg-thumbnail'
import 'lg-zoom';

class ImageMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 图片消息添加画廊效果
    */
    onLightGallery = node => {
        this.lightGallery = node;
        $(node).lightGallery();
    }

    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }

    /**
     * 图片消息
    */
    render () {
        let { src, loadHandler=undefined } = this.props;
        return (
            <div className={"msg-item image-msg"} ref={this.onLightGallery} >
                <div className="msg-item-img-wrapper" data-src={src}>
                    <img onLoad={loadHandler} src={src} alt="" title="" className="msg-item-img" />
                </div>
            </div>
        )
    }
}

export default ImageMsg;
