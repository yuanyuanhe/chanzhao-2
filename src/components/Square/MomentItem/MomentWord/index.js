import React, { Component } from 'react';
import "./index.css";
class MomentWord extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 秘圈文本部分组件
     * words: {String} 文本字符串
    */
    render () {
        let { words } = this.props;
        return (
            <div className={"moment-word"}>
                { words }
            </div>
        )
    }
}

export default MomentWord;
