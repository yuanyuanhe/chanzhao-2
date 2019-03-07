import React, { Component } from 'react';
import "./index.css";
import $ from 'jquery'
import 'lightgallery';
import 'lg-thumbnail'
import 'lg-zoom';

class MomentImage extends Component{

    /**
     * 画廊插件处理图片，使其可点击查看大图
    */
    onLightGallery = node => {
        this.lightGallery = node;
        $( node ).lightGallery();
    };

    /**
     * 组件接绑时，删除画廊相关事件
    */
    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }

    /**
     * 单张图片秘圈组件
     * src: {String} 图片路径，相对路径
    */
    render () {
        let { src } = this.props;
        src = src.convertSrcWebp();
        return (
            <div className={"moment-item-image"} ref={this.onLightGallery} >
                <div className="moment-item-image-wrapper" data-src={src}>
                    <img src={src} alt="" title="" />
                </div>
            </div>
        )
    }
}

export default MomentImage;
