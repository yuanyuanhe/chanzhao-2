import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./index.css"
import {checkHost} from "../../../../util";

class HomeAnchor extends Component{
    constructor ( props ) {
        super( props );
    }

    /**
     * 跳转到广场首页
    */
    jumpToSquare = () => {
        let { history, location: { pathname } } = this.props;
        if ( !this.inHome( pathname ) ) {
            history.push('/square');
        } else {
            document.querySelector('.main').scroll(0, 0);
            return;
        }
    }

    /**
     * 判断当前是否在广场首页
    */
    inHome ( pathname ) {
        if ( /square\/userCenter|square\/findback/.test( pathname ) ){
            return false;
        }
        return true;
    }

    /**
     * 导航条首页大icon
     *
    */
    render () {
        let { location: { pathname } } = this.props;
        return (
            <div className={"home-anchor-container" + ( this.inHome( pathname ) ? ' cur' : "" ) } onClick={this.jumpToSquare}>
                <div className="home-anchor-img"></div>
                <span className="home-anchor-text">首页</span>
            </div>
        )
    }
}

export default withRouter( HomeAnchor );