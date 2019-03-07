import React, { Component } from 'react';
import "./index.css";
class MomentTopic extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 秘圈话题组件
     * text: {String} 话题文本
    */
    render () {
        let { text } = this.props;
        return (
            <div className={"moment-item-topic"}>
                {text}
            </div>
        )
    }
}

export default MomentTopic;
