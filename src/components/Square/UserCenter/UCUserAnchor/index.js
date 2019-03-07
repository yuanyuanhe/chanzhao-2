import React, { Component } from 'react';
import { withRouter,Link } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
class UCUserAnchor extends Component{
    constructor( props ) {
        super( props );
    }

    jump = () => {
        let { data: { to }, history } = this.props;
        history.push( to );
    }

    /**
     * 广场首页右侧跳转到聊天的按钮
    */
    render () {
        let { data: { type = "", text = "", to, num } } = this.props;

        return (
            <div className="uc-user-anchor-container" onClick={!!to ? this.jump : undefined }>
                <div className="uuac-number auto-omit">{num}</div>
                <div className="uuac-text">{text}</div>
            </div>
        )
    }
}

export default withRouter( UCUserAnchor );
