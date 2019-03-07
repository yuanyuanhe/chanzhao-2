import React, { Component } from 'react';
import "./index.css";
import {SESSION_MENU} from "../../../../../../../configs/consts";
import {toggleSwitchs, offSwitch} from "../../../../../../../redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
class MenuItem extends Component{
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
    }

    clickHandler( e ) {
        let { data: { clickHandler }, offMenuSwitch } = this.props;
        !!clickHandler && clickHandler();
        !!offMenuSwitch && offMenuSwitch();
        e.preventDefault();
    }

    /**
     * 会话菜单item组件
     * icon: {String} item的icon路径，绝对路径
     * text: {String} item文本
    */
    render () {
        let { data: { icon, text } } = this.props;
        return (
            <div className={'ml-menu-item'} onClick={this.clickHandler}>
                <img className={'ml-menu-item-icon'} src={icon} alt={text} title={text} />
                <span className="ml-menu-item-text">{text}</span>
            </div>
        )
    }
}
function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( dispatch ) {
    return {
        offMenuSwitch: () => dispatch( offSwitch( SESSION_MENU ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( MenuItem ) );
