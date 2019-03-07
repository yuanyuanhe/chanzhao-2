import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {offSwitch} from "../../../../../redux/actions";
import {CHATTING_HISTORY} from "../../../../../configs/consts";
import {getHistoryStateBySID} from "../../../../../redux/store/storeBridge";
import MsgArea from './MsgArea';
import $ from "jquery";

const chatHistoryResize = 'resize.chatHistoryResize'
class ChattingHistory extends Component{
    constructor( props ) {
        super( props );
        this.hideHistory = this.hideHistory.bind( this );
        this.setMainHeight = this.setMainHeight.bind( this );
    }

    componentDidMount () {
        $(window).resize();
    }

    setMainHeight( node ) {
        if ( !node ) {
            $(window).off(chatHistoryResize);
            return;
        }
        $(window).on( chatHistoryResize, () => {
            if ( !/chatting-history-main/g.test( node.className ) ) {
                return;
            }
            this.setHeight( node );
        } );
    }

    /**
     * resize的时候修改面板大小方法
    */
    setHeight( node ) {
        let innerHeight = window.innerHeight;
        let innerwidth = window.innerWidth;
        if ( innerHeight < 600 ) {
            //240
            node.style.height = 600 - 50 + 'px';
        }
        if ( innerHeight > 600 && innerHeight <= 1000 ) {
            //240
            node.style.height = innerHeight - 70 + 'px';
        } else if ( innerHeight > 1048 ) {
            if ( innerwidth > 1240 ) {//split
                node.style.height = 1048 - 70 + 'px';
            } else {
                node.style.height = innerHeight - 70 + 'px';
            }
        }
    }

    hideHistory() {
        this.props.hideHistory( this.props.sid );
    }

    /**
     * 聊天记录面板组件
     * hideHistory: {Function} 隐藏聊天记录方法
     * sid: {String} session id
    */
    render () {
        //move to state
        let { hideHistory, sid } = this.props;
        let show = getHistoryStateBySID( sid );

        return (
            <div className={'chatting-history-container clear' + ( show ? ' show' : "" )}>
                <div className="session-main-header">
                    <span className={ 'session-main-header-name' }>{"聊天记录"}</span>
                    <div className="vertical-middle history-session-menu-container back" onClick={this.hideHistory}></div>
                </div>
                <div className="chatting-history-main" ref={this.setMainHeight}>
                    <MsgArea show={show} sid={sid} />
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        historyState: state.switchs[CHATTING_HISTORY]
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        hideHistory: ( sid ) => dispatch( offSwitch( CHATTING_HISTORY, { sid } ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( ChattingHistory ) );
