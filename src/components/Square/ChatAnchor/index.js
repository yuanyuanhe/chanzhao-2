import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css';
class ChatAnchor extends Component{
    constructor( props ) {
        super( props );
        this.jumpToChat = this.jumpToChat.bind( this );
    }

    jumpToChat () {
        let { history } = this.props;
        history.push( "/chat/session" );
    }

    /**
     * 屏幕右侧跳转到聊天的anchor
    */
    render () {
        return (
            <div className="chat-anchor" onClick={this.jumpToChat}>

            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( ChatAnchor ) );
