import React, { Component } from 'react';
import "./index.css";
class SelectorLine extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 好友/群组选择器里分组的小标题ABCD其他
     * groupName: {String} A-Z&others 分组名
    */
    render () {
        let { groupName } = this.props;
        return (
            <div className={'selector-line'}>
                { groupName === 'others' ? "其它" : groupName.toUpperCase()}
            </div>
        )
    }
}

export default SelectorLine;
