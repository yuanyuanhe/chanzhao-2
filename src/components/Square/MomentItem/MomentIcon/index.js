import React, { Component } from 'react';
import "./index.css";
class MomentIcon extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * icon点击处理方法
     * callback: {Function} 点击回调
    */
    clickHandler = ( e ) => {
        let { data: { cur}, callback } = this.props;
        callback && callback( cur );
    }

    /**
     * 秘圈menu栏的icon组件（点赞、评论、转发。。）
     * data: { Object } icon相关数据
     *     {
     *         src: {String} icon图标地址，绝对路径
     *         num: {Number} 如果有数量信息，则存储数量
     *         text: {String} 文本
     *         cur: {Boolean} 是否处于被选中状态
     *         curSrc: {String} 被选中状态的icon src, 绝对路径
     *     }
    */
    render () {
        let { data: { src, num, text, cur, curSrc } } = this.props;
        return (
            <div className={"moment-item-icon"} onClick={this.clickHandler}>
                <img className={'mii-img'} src={ !cur ? src : curSrc } alt={text} title={text} />
                <span className="mii-text">{text + ( typeof num !== 'undefined' ? `(${num})` : "" ) }</span>
            </div>
        )
    }
}

export default MomentIcon;
