import React, { Component } from 'react';
import "./index.css";
class SelectCircle extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 选择器后面的小园点，可选中
     * selected: {Boolean} 是否已被选中
     * clickHandler: {Function} 点击处理方法
    */
    render () {
        let { selected, clickHandler } = this.props;
        return (
            <span onClick={ clickHandler || undefined } className={'select-circle vertical-middle' + ( selected ? ' selected' : "" )}></span>
        )
    }
}

export default SelectCircle;
