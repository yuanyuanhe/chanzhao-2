import React, { Component } from 'react';
import "./index.css";
class DateTip extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 日期提示
    */
    render () {
        let { date } = this.props;
        return (
            <div className={"session-tip-date"}>
                { date }
            </div>
        )
    }
}

export default DateTip;
