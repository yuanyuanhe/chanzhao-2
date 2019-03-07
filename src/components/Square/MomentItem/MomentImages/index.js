import React, { Component } from 'react';
import "./index.css";
import $ from 'jquery'
import 'lightgallery';
import 'lg-thumbnail'
import 'lg-zoom';

class MomentImages extends Component{
    constructor( props ) {
        super( props );
        this.loadHandler = this.loadHandler.bind( this );
    }

    /**
     * 画廊插件处理图片，使其可点击查看大图
    */
    onLightGallery = node => {
        this.lightGallery = node;
        $(node).lightGallery();
    }

    /**
     * 组件接绑时，删除画廊相关事件
    */
    componentWillUnmount() {
        $(this.lightGallery).data('lightGallery').destroy(true);
    }

    loadHandler ( e ) {
        let target = e.target,
            className = target.className;
        if ( target.width <= target.height ) {
            className += " mi-vertical-middle";
        } else {
            className += " mi-horizontal-middle";
        }
        target.className = className;
    }

    /**
     * 多张图片秘圈组件，九宫格展示
     * srcs: {Array} 图片链接数组，相对路径
    */
    render () {
        let { srcs } = this.props;
        return (
            <div className={"moment-item-images clear"} ref={this.onLightGallery}>
                { srcs.map( ( v, i ) => (
                    <div className="moment-item-image-wrapper-multi" data-src={v.convertSrcWebp()} key={i}>
                        <img onLoad={this.loadHandler} src={v.convertSrcWebp()} alt="" title="" />
                    </div>
                ) ) }
            </div>
        )
    }
}

export default MomentImages;
