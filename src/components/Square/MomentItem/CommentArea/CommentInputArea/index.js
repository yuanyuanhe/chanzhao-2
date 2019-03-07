import React, { Component, Fragment } from 'react';
import "./index.css";
class CommentInputArea extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            text: ""
        }
    }

    changeHandler = ( e ) => {
        this.setState( {
            text: e.target.value
        } )
    }

    /**
     * 发送按钮点击处理
     * callback: 点击按钮在上级组件中的处理，输入框文本作为参数传入
    */
    submit = () => {
        if ( this.submiting ) {
            return;
        }
        let { callback } = this.props;
        let { text } = this.state;
        if ( text === "" || typeof text !== 'string' ) {
            return;
        }
        !!callback && callback( text ).then( () => {
            this.setState( {
                text: ""
            } );
        } );

    }

    /**
     * 评论输入区域
    */
    render () {
        /**
         * props:
         * callback
        */
        let { text } = this.state;
        return (
            <Fragment>
                <textarea value={text} onChange={this.changeHandler} placeholder={'说点什么吧'} name="" id="" cols="30" rows="10" className="comment-input"></textarea>
                <button onClick={this.submit} className="comment-submit">发送</button>
            </Fragment>
        )
    }
}

export default CommentInputArea;
