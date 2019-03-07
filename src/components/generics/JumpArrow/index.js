import React, { Component } from 'react';
import "./index.css";
import {withRouter} from 'react-router-dom';
class JumpArrow extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 通用小标题里的箭头
     * to: 需要跳转的路由;需求由原点击箭头跳转改为点击整个小标题跳转，to就变成了是否显示小箭头的开关属性
    */
    render () {
        let { to } = this.props;
        return to ? <span className="jump-arrow"></span> : false
    }
}

export default withRouter(JumpArrow);
