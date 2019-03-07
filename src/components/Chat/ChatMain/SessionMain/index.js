import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import ChatArea from './ChatArea';
import Header from './Header';
import InputArea from './InputArea';
import ChattingHistory from './ChattingHistory';
import {getSessionById} from "../../../../redux/store/storeBridge";

class SessionMain extends Component{
    constructor( props ) {
        super( props );
        this.chatAreas = {};
    }

    /**
     * 获取聊天部分，其他会话使用dispaly:none隐藏
     * 如果每次都重新渲染的话，切换回原来的会话面板图片会重新加载，浪费流量
    */
    getChatArea( sid ) {
        let { chatAreas } = this;
        for ( let key in chatAreas ) {
            chatAreas[key].visiable = false;
        }
        if ( chatAreas[ sid ] ) {
            chatAreas[ sid ].visiable = true;
        } else {
            chatAreas[ sid ] = {
                sid: sid,
                visiable: true
            }
        }

        return Object.values( chatAreas ).map( ( { visiable, sid }, i ) => <ChatArea sid={sid} key={i} visiable={visiable} /> )
    }

    /**
     * 会话面板组件
    */
    render () {
        let sessionId = this.props.match.params.sessionId,
            session = getSessionById( sessionId );
        let { showModal } = this.props;
        let chatArea = this.getChatArea( sessionId );
        return (
            <div className={"session-main-container clear"}>
                <Header showModal={showModal} sid={sessionId} session={session} />
                { chatArea }
                <InputArea showModal={showModal} fileId={this.props.fileId} sid={sessionId} data={session} inputChange={this.props.inputChange} words={this.props.words} />
                <ChattingHistory sid={sessionId}/>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        sessions: state.sessions
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( SessionMain ) );
