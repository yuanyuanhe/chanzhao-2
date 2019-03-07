import React, { Component } from 'react';
import "./index.css";
import { ICON_FRIENDS_DELETE2 } from '../../../../../configs/iconNames'
class ImageItem extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showHover: false
        }
    }

    /**
     * 图片加载后居中处理（可以考虑换成Avatar组件）
    */
    loadHandler ( e ) {
        let target = e.target,
            className = target.className;
        if ( target.width <= target.height ) {
            className += " psi-image-vertical-middle";
        } else {
            className += " psi-image-horizontal-middle";
        }
        target.className = className;
    }

    /**
     * 删除按钮点击回调
    */
    deleteHandler = () => {
        let { deleteImage, index } = this.props;
        !!deleteImage && deleteImage( index );
    }

    /**
     * mouserover handler 显示删除按钮
    */
    overHandler = () => {
        this.setState( {
            showHover: true
        } );
    }

    /**
     * mouseleave handler， 隐藏删除按钮
    */
    leaveHandler = () => {
        this.setState( {
            showHover: false
        } );
    }

    /**
     * 图片选择器图片item组件,鼠标悬浮显示删除按钮
     * dataUrl: { String } 用户选择的图片文件转化的dataUrl
    */
    render () {
        let { dataUrl } = this.props;
        let { showHover } = this.state;
        return (
            <div className={'psi-image-item'} onMouseOver={this.overHandler} onMouseLeave={this.leaveHandler}>
                <img onLoad={this.loadHandler} src={dataUrl} alt="" title="" className="psi-image" />
                { !showHover ? false :
                    <div className="psi-hover">
                        <img src={ICON_FRIENDS_DELETE2.convertIconSrc()} alt="删除" title='删除' className="psi-hover-delete" onClick={this.deleteHandler} />
                    </div>
                }
            </div>
        )
    }
}

export default ImageItem;
