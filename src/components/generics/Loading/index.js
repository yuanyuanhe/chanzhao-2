import React, { Component } from 'react';
import "./index.css";
import LoadingWithDot from "../LoadingWithDot";
class Loading extends Component{
    get defaultText () {
        return "Loading.";
    }

    /**
     * 加载状态组件
     * classes: {Array} 引用组件引用时添加的自定义css类名，用于定制样式
    */
    render () {
        let { classes = [] } = this.props;
        return (
            <LoadingWithDot text={this.defaultText} classes={classes.concat( [ 'ab-middle', 'loading' ] ) } />
        )
    }
}

export default Loading;
