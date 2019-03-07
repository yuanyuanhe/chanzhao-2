import React, { Component } from 'react';
import "./index.css";
class MomentArticle extends Component{
    constructor( props ) {
        super( props );
    }

    getAnchor = ( node ) => {
        this.$anchor = node;
    }

    jumpToUrl = () => {
        !!this.$anchor && this.$anchor.click();
    }

    /**
     * 文章秘圈
     * data: {Object}: 秘圈渲染所需数据
     *     {
     *         title: {String} 标题文本
     *         url: {String} 文章链接
     *         title: {avatar} 配图链接，相对路径
     *     }
    */
    render () {
        let { data: { title, url, avatar } } = this.props;
        if ( !title ) {
            return false;
        }
        return (
            <div className={"moment-item-gameShare shadow"} style={ { cursor: "pointer" } } onClick={this.jumpToUrl}>
                <img className={'moment-item-gameShare-avatar'} src={avatar.convertSrcWebp()} alt="" title="" />
                <div className="moment-item-gameShare-title bw">
                    {title}
                </div>
                <a ref={this.getAnchor} style={ { display: "none" } } href={url} target={"blank"}></a>
            </div>
        )
    }
}

export default MomentArticle;
