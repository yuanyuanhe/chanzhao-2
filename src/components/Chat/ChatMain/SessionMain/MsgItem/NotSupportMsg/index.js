import React, { Component } from 'react';
import "./index.css";
class NotSupportMsg extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 暂不支持的消息类型
     * type: {String} 消息类型
    */
    render () {
        let { type } = this.props;
        return (
            <div className={"msg-item not-support-msg"}>
                { `你收到一条${type}消息，请在手机端查看。` }
            </div>
        )
    }
}

export default NotSupportMsg;
