import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
class Prompt extends Component{
    constructor( props ) {
        super( props );
        this.submitHandler = this.submitHandler.bind( this );
        this.cancelHandler = this.cancelHandler.bind( this );
        this.changeHandler = this.changeHandler.bind( this );
        this.state = {
            value: ""
        }
    }

    changeHandler( e ) {
        this.setState( {
            value: e.target.value
        } )
    }

    submitHandler() {
        let { callback, preLocation, state: { autoReplace } } = this.props;
        if ( !!callback ) {
            callback( this.state.value );
            !!autoReplace && this.props.history.replace( preLocation );
        } else {
            this.props.history.replace( preLocation );
        }
    }

    cancelHandler() {
        let { cancelCallback, preLocation, state: { autoReplace } } = this.props;
        if ( !!cancelCallback ) {
            cancelCallback( this.state.value );
            !!autoReplace && this.props.history.replace( preLocation );
        } else {
            this.props.history.replace( preLocation );
        }
    }

    /**
     * 通用弹框之prompt
     * cancelCallback: { Function } 取消按钮点击回调
     * preLocation: { react router location }准备弹出时的router location,用于返回前一级路由
     * callback: { Function } 确定按钮点击回调
     * state: {Object} 弹框的状态参数
     *     {
     *         inputType: {String} 弹框内输入框的type属性：text, password等
     *         title: {String} alert标题，如果没有则不显示标题
     *         text: {String} 提示文字，原则上必须要有，否则没必要弹出
     *         autoReplace: { Boolean }:标记路由转换是否要在点击处理方法运行后自动转换，true则自动转换，
     *                      false则需要在callback中手动替换，主要为了防止在已有弹框的情况下弹出，
     *                      比如输入密码prompt时还需要弹出错误提示，此时直接替换preLocation的话prompt弹框也会一起消失
     *     }
    */
    render () {
        let { title, text, inputType } = this.props.state;
        return (
            <div className={'modal-wrapper shadow'}>
                {!!title ? <div className="modal-title prompt-title">{title}</div> : false}
                {/*{!!text ? <div className="modal-text">{text}</div> : false}*/}
                <input type={ inputType || "text" } className={"modal-input"} value={this.state.value} onChange={this.changeHandler} placeholder={text} />
                <div className="modal-btn-wrapper">
                    <button className={'modal-btn modal-cancel'} onClick={this.cancelHandler}>取消</button>
                    <button className={'modal-btn modal-submit'} onClick={this.submitHandler}>确定</button>

                </div>

            </div>
        )
    }
}

export default withRouter(Prompt);