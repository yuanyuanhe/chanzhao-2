import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
import {startChatWith} from "../../../../../util";
import {sendAddFocusedUserRequest, sendDeleteFocusedUserRequest} from "../../../../../requests";
import {MSGIDS} from "../../../../../configs/consts";
import {CANCEL_FOCUS_ERROR, FOCUS_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../../configs/TIP_TEXTS";
class HeaderBtnLine extends Component{
    constructor( props ) {
        super( props );
        this.chatClicking = false;
        this.focusClicking = false;
    }

    chatHandler = () => {
        if( this.chatClicking ) {
            return;
        }
        this.chatClicking = true;
        let { account, history } = this.props;
        startChatWith( account, history ).finally( () => {
            this.chatClicking = false;
        } );
    }

    focusHandler = () => {
        if( this.focusClicking ) {
            return;
        }
        this.focusClicking = true;
        let { account, focused, showModal, refreshState } = this.props;
        if ( focused ) {
            sendDeleteFocusedUserRequest( account ).then( ( { msgId } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    !!refreshState  && refreshState(account);
                } else {
                    showModal( { text: CANCEL_FOCUS_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e );
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.focusClicking = false;
            } );
        } else {
            sendAddFocusedUserRequest( account ).then( ( { msgId } ) => {
                if ( msgId === '200' ) {
                    !!refreshState && refreshState(account);
                } else {
                    showModal( { text: FOCUS_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e );
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.focusClicking = false;
            } );
        }
    }

    /**
     * 用户中心左上角tab中的两个按钮
     * account: {String|Int} 用户帐号
     * focused: {Boolean} 是否已关注此人
    */
    render () {
        let { account, focused } = this.props;
        return (
            <div className={'uc-header-btn-line clear'}>
                <div className="uc-header-btn uc-header-chat" onClick={this.chatHandler}>聊天</div>
                <div className={"uc-header-btn uc-header-focus" + ( focused ? " focused" : '' )} onClick={this.focusHandler}>{ focused ? '取关' : "关注" }</div>
            </div>
        )
    }
}

export default withRouter(HeaderBtnLine);
