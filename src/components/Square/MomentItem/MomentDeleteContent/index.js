import React, { Component } from 'react';
import "./index.css";

class MomentDeledContent extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 被转发的秘圈已被删除时显示此组件
    */
    render () {
        return (
            <div className={"moment-item-deleted-content"}>
                此秘圈已被删除
            </div>
        )
    }
}

export default MomentDeledContent;
