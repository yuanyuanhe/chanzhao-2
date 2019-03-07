import React, { Component } from 'react';
import "./index.css";
import { ICON_CANCEL, ICON_TALK_ADD } from '../../../../configs/iconNames';
import ImageItem from './ImageItem';

class ImageSelector extends Component{
    constructor( props ) {
        super( props );
        //最多可以选择9张
        this.max = 9;
        this.state = {

        }
    }

    hideClickHandler = () => {
        let { hideSelector } = this.props;
        !!hideSelector && hideSelector();
    }

    /**
     * 图片选择器组件
     * show: { Boolean } 选择器显示开关
     * images: { Array } 已被选择图片的dataUrl数组
     * addImage: {Function} 添加图片方法
     * deleteImage: {Function} 删除图片方法
    */
    render () {
        let { show, images, addImage, deleteImage } = this.props;
        let curNum = images.length;
        return (
            <div className={'publisher-image-selector-container clear shadow' + ( show ? ' show' : "" )}>
                <div className="pis-header">
                    本地上传
                    <img src={ICON_CANCEL.convertIconSrc()} alt="关闭" title="关闭" className="pis-close" onClick={this.hideClickHandler} />
                </div>
                <div className="psi-tip">
                    共{curNum}张，还能上传{this.max - curNum}张
                </div>
                <div className="psi-image-container clear">
                    { images.map( ( { dataUrl, index }, i ) => <ImageItem key={i} deleteImage={ deleteImage } dataUrl={dataUrl} index={index} /> ) }
                    {
                        curNum >= this.max ? false :
                            <div className="psi-image-item psi-add-item" onClick={ addImage }>
                                <img src={ICON_TALK_ADD.convertIconSrc()} alt="" title="" />
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default ImageSelector;
