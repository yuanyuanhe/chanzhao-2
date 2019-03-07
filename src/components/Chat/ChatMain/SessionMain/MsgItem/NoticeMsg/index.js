import React, { Component } from 'react';
import "./index.css";
class NoticeMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 通知类消息
     * text: {String} 通知文本
    */
    render () {
        let { text } = this.props;
        return (
            <span className={"msg-item notice-msg auto-omit"}>
                { text }
            </span>
        )
    }
}

export default NoticeMsg;
