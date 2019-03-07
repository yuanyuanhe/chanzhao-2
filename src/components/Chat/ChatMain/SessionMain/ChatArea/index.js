import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getMsgs} from "../../../../../redux/store/storeBridge";
import MsgItem from '../MsgItem';
import EmptyMsgItem from '../EmptyMsgItem';
import $ from "jquery";
import Push from "push.js";
import ScrollContainer from "../../../../generics/ScrollContainer";
import {getMsgProfileByLastMsg} from "../../../../../util";

const chatAreaResize = 'resize.chatAreaResize';
class ChatArea extends Component{
    constructor( props ) {
        super( props );
        this.resetHeigth = this.resetHeigth.bind(this);
        this.getScrollNode = this.getScrollNode.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    /**
     * 设置面板高度
    */
    setHeight( node ) {
        let innerHeight = window.innerHeight;
        let innerwidth = window.innerWidth;
        if ( innerHeight < 600 ) {
            //240
            node.style.height = 600 - 240 + 'px';
        }
        if ( innerHeight > 600 && innerHeight <= 1048 ) {
            //240
            node.style.height = innerHeight - 240 + 'px';
        } else if ( innerHeight > 1048 ) {
            if ( innerwidth > 1240 ) {//split
                node.style.height = 1048 - 416 + 'px';
            } else {
                node.style.height = innerHeight - 416 + 'px';
            }

        }
    }

    /**
     * 添加resize事件监听，根据Viewport尺寸设置面板size
    */
    resetHeigth ( node ) {
        if ( !node ) {
            $(window).off(chatAreaResize);
            return;
        }
        $(window).on( chatAreaResize, () => {
            if ( !/session-main-chat-area/g.test( node.className ) ) {
                return;
            }
            this.setHeight( node );
        } );
    }

    /**
     * 组件装载时主动触发resize事件设置元素的size
    */
    componentDidMount () {
        $(window).resize();
    }

    getScrollNode( node ){
        this.scrollNode = node;
    }

    /**
     * 滚动到会话面板最底端
    */
    scrollToBottom(){
        if ( !!this.scrollNode ) {
            this.scrollNode.scrollTop = this.scrollNode.scrollHeight;
        }
    }

    /**
     * 获取消息组件列表
    */
    getMain( msgs ) {
        if ( !msgs || !Array.isArray( msgs ) || Array.isArray( msgs ) && msgs.length === 0 ) {
            return <EmptyMsgItem/>
        }

        return (
            <ScrollContainer getScrollNode={ this.getScrollNode } toBottom={true}>
                { msgs.map( ( v, i ) => {
                    return <MsgItem scrollToBottom={this.scrollToBottom} msgs={msgs} i={i} msg={v} key={i} />
                } ) }
            </ScrollContainer>

        );
    }

    /**
     * 会话面板消息展示区
    */
    render () {
        let { sid, visiable } = this.props,
            msgs = getMsgs( sid );
        let main = this.getMain( msgs );//msgs
        return (
            <div className={"session-main-chat-area" + ( visiable ? "": " hide" )} ref={this.resetHeigth}>
                { main }
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        msgs: state.msgs
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( ChatArea ) );
