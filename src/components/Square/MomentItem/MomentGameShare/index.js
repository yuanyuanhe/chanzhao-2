import React, { Component } from 'react';
import "./index.css";
class MomentGameShare extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 游戏分享类型秘圈，现在已和文章类型秘圈合并，兼容老数据用
     * data: {Object} 秘圈中的相关数据
     *     {
     *         title: {String} 标题文本
     *         url: {String} 链接
     *         thumbnail: 缩略图路径，相对路径
     *     }
    */
    render () {
        let { data: { title, url, thumbnail } } = this.props;
        if ( !title ) {
            return false;
        }
        return (
            <div className={"moment-item-gameShare shadow"}>
                <img className={'moment-item-gameShare-avatar'} src={thumbnail.convertSrcWebp()} alt="" title="" />
                <div className="moment-item-gameShare-title bw">
                    {title}
                </div>
            </div>
        )
    }
}

export default MomentGameShare;
