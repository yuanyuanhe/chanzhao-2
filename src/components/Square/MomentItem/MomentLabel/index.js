import React, { Component } from 'react';
import "./index.css";
class MomentLabel extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 标签组件
     * text: {String} 标签文本
    */
    render () {
        let { text } = this.props;
        return (
            <div className={"moment-item-label"}>
                {`#${text}#`}
            </div>
        )
    }
}

export default MomentLabel;
