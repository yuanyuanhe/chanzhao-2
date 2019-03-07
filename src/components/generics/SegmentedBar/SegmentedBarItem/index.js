import React, { Component } from 'react';
import "./index.css";

class SegmentedBarItem extends Component {
    constructor( props ) {
        super( props );
    }

    changeHandler = () => {
        this.props.onCurChange( this.props.data.key );
    };

    render() {
        const { data: { key, text, icon, selectedIcon } , cur } = this.props;
        return (
            <div className={"segmentedbar-item" + (cur === key ? " cur" : "")} onClick={this.changeHandler}>
                <span> { icon ? <img src={ cur === key ? selectedIcon : icon } alt="" title="" /> : false } { text }</span>
            </div>
        );
    }
}

export default SegmentedBarItem;