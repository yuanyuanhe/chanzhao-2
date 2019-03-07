import React, { Component } from 'react';
import "./index.css";
class TimeTag extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 时间标志，分割消息用
    */
    render () {
        let { time } = this.props;
        return (
            <div className={'time-tag'}>
                - - { time } - -
            </div>
        )
    }
}

export default TimeTag;
