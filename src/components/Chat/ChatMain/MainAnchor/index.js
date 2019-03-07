import React, { Component } from 'react';
import "./index.css";
class MainAnchor extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 详情部分按钮组件
     * src: 按钮icon src
    */
    render () {
        let { data: { src, clickHandler } } = this.props;
        return (
            <img className={"friend-main-anchor"} src={ src } alt="" title="" onClick={clickHandler} />
        )
    }
}

export default MainAnchor;
