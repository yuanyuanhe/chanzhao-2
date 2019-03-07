import React, { Component } from 'react';
import "./index.css";
class UnreadTip extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 未读提示
    */
    render () {
        let { num } = this.props;
        return (
            <div className={"session-tip-upread"}>
                { num }
            </div>
        )
    }
}

export default UnreadTip;
