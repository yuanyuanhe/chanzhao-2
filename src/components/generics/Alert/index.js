import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
class Alert extends Component{
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
    }

    clickHandler() {
        let { callback, preLocation, state: { autoReplace } } = this.props;
        if ( window._token_expired ) {
            window.location.reload();
        }
        if ( !!callback ) {
            callback();
            !!autoReplace && this.props.history.replace( preLocation );
        } else {
            this.props.history.replace( preLocation );
        }
    }

    /**
     * 通用弹框之alert
     * title: {String} alert标题，如果没有则不显示标题
     * text: {String} 提示文字，原则上必须要有，否则没必要弹出
     * callback: { Function } 确定按钮点击回调
     * preLocation: { react router location }准备弹出时的router location,用于返回前一级路由
     * state: {Object} 弹框的状态参数
     *     {
     *         autoReplace: { Boolean }:标记路由转换是否要在点击处理方法运行后自动转换，true则自动转换，
     *                      false则需要在callback中手动替换，主要为了防止在已有弹框的情况下弹出，
     *                      比如输入密码prompt时还需要弹出错误提示，此时直接替换preLocation的话prompt弹框也会一起消失
     *     }
    */
    render () {
        let { title, text, callback } = this.props.state;
        return (
            <div className={'modal-wrapper shadow'}>
                {!!title ? <div className="modal-title">{title}</div> : false}
                {!!text ? <div className="modal-text">{text}</div> : false}
                <div className="modal-btn-wrapper">
                    <button className={'modal-btn modal-submit'} onClick={this.clickHandler}>确定</button>
                </div>

            </div>
        )
    }
}

export default withRouter(Alert);