import React, { Component } from 'react';
import { withRouter,NavLink } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {MENU_ADD,MENU_TEAM,MENU_FRIEND,MENU_SESSION} from "../../../../configs/consts";
class MenuItem extends Component{
    constructor( props ) {
        super( props );
    }

    getTo( type, to ) {
        switch( type ) {
            case MENU_SESSION:
                return `${to}/${this.props.currentSessionId}`;
            case MENU_FRIEND:
            return `${to}/${this.props.friendTabId}`;
            case MENU_TEAM:
            return `${to}/${this.props.teamTabId}`;
            case MENU_ADD:
            return `${to}`;
            default:
                return to;
        }
    }

    /**
     * 聊天菜单item，主要跳转路由
    */
    render () {
        let { to, type, src } = this.props.data;
        to = this.getTo( type, to );
        return (
            <NavLink className={'chat-menu-link'} activeClassName="chat-menu-link-active" to={to} replace>
                <img src={src} alt="" title="" />
            </NavLink>
        )
    }
}

function mapStateToProps( state ) {
    return {
        currentSessionId: state.currentSessionId,
        friendTabId: state.friendTabId,
        teamTabId: state.teamTabId
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( MenuItem ) );
