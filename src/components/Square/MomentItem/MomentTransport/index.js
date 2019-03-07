import React, { Component } from 'react';
import "./index.css";
class MomentTransport extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 转发秘圈包装组件，宽度小，背景色灰
    */
    render () {
        let children = this.props.children;
        return (
            <div className={"moment-item-transport-container"}>
                { children }
            </div>
        )
    }
}

export default MomentTransport;
