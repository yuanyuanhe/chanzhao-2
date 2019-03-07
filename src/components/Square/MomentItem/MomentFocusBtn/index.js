import React, { Component } from 'react';
import "./index.css";
import {connect} from "react-redux";
import {getUserUID, userIsFocused} from "../../../../redux/store/storeBridge";
import {sendAddFocusedUserRequest, sendDeleteFocusedUserRequest} from "../../../../requests";
import {cancelFocusUserInMoment, focusUserInMoment} from "../../../../redux/actions";
import {CANCEL_FOCUS_ERROR, FOCUS_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";
import {MSGIDS} from "../../../../configs/consts";

const text = {
    false: '关注',
    true: '已关注'
};

class MomentFocusBtn extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 按钮点击事件处理方法
     * filter: {String} moment provider的分类
     * cancelFocus: {Function} 将redux数据中此用户发送的所有秘圈的关注状态改为未关注，不需要刷新整个provider部分
     * focusUser: {Function} 将redux数据中此用户发送的所有秘圈的关注状态改为已关注，不需要刷新整个provider部
     * showModal: {Function} 提示弹框通用方法
    */
    clickHandler = () => {
        let { account, focused, filter, focusUser, cancelFocus, showModal } = this.props;
        if ( focused ) {
            sendDeleteFocusedUserRequest( account ).then( ( { msgId } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    cancelFocus( filter, account );
                } else {
                    showModal( { text: CANCEL_FOCUS_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e );
                showModal( { text: REQUEST_ERROR } );
            } )
        } else {
            sendAddFocusedUserRequest( account ).then( ( { msgId } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    focusUser( filter, account );
                } else {
                    showModal( { text: FOCUS_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e );
                showModal( { text: REQUEST_ERROR } );
            } )
        }
    }

    /**
     * 秘圈header菜单中的关注按钮
     * account: {String|Int} 用户帐号
     * focused: {Boolean} 是否已关注此用户
    */
    render () {
        let { account, focused } = this.props,
            userUID = getUserUID();
        if ( userUID == account ) {
            return false;
        }
        return (
            <div className={ 'moment-focus-btn ' + ( focused ? "focused" : "" )} onClick={this.clickHandler} >
                { text[ focused ] }
            </div>
        )
    }
}
/**
 * focusedUsers更新时重新渲染此组件
*/
function mapStateToProps( state ) {
    return {
        focusedUsers: state.focusedUsers
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        focusUser: ( momentType, account ) => dispatch( focusUserInMoment( momentType, account ) ),
        cancelFocus: ( momentType, account ) => dispatch( cancelFocusUserInMoment( momentType, account ) )
    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( MomentFocusBtn );
