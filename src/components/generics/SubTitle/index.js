import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import JumpArrow from '../JumpArrow';
class SubTitle extends Component{
    constructor( props ) {
        super( props );
    }

    clickHandler = () => {
        let { clickHandler, history, to } = this.props;
        !!clickHandler&& clickHandler();
        !!to && history.push( to );
    }

    /**
     * 通用小标题组件
     * iconSrc: {String} 左边icon的链接地址
     * text：{String} 标题文本
     * to:{String} 需要跳转到的链接
     * clickHandler:{Function} 点击回调方法
     * classes:{Array} 引用组件自定义样式用类名数组
     * clildren:{Object} react component children
    */
    render () {
        let { iconSrc = "", text = "", to, clickHandler, classes = [], children } = this.props;

        return (
            <div className={ "uc-moment-anchor-container " + ( classes.join( " " ) ) } style={ clickHandler || to ? {cursor: 'pointer'} : undefined } onClick={ this.clickHandler } >
                <img className={"uc-moment-anchor-icon"} src={iconSrc.convertIconSrc()} alt={text} title={text} />
                { text ? <span className={'uc-moment-text'}>{text}</span> : children }
                <JumpArrow to={to}/>
            </div>
        )
    }
}

export default withRouter( SubTitle );
