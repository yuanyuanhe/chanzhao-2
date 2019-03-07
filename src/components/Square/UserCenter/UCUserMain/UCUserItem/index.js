import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {convertWebp, getUserCenterRouter, getUserData, startChatWith} from "../../../../../util";
import {getPersonById, getUserUID} from "../../../../../redux/store/storeBridge";
import Avatar from '../../../../generics/Avatar';
import {MODAL_CONFIRM, MSGIDS, userType} from '../../../../../configs/consts';
import {sendAddFocusedUserRequest, sendDeleteFocusedUserRequest, sendDeleteFriendRequest, sendUserIsFocusedRequest} from "../../../../../requests";
import {checkUsersData} from "../../../../../util/user";
import {CANCEL_FOCUS_ERROR, DATA_ERROR, DELETE_FRIEND_CONFIRM, DELETE_FRIEND_ERROR, FOCUS_ERROR, GET_FOCUS_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../../configs/TIP_TEXTS";
class UCUserItem extends Component{
    constructor( props ) {
        super( props );
        this.avatarStyle = {
            width: "58px",
            height: "58px",
            float: "left",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)"
        }
        this.state = {
            focused: false,
            cantClickFocus: false,
            expiredTimes: {}
        }
        this.inited = false;
    }

    /**
     * 获取当前时刻时间戳
    */
    get now () {
        return Date.now();
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.data.uid !== this.props.data.uid ) {
            this.getUserData( nextProps );
        }
    }

    /**
     * 获取用户的关注状态等数据
    */
    //get if user is focused when mouse is over the item( menu shows )
    getUserData = ( props ) => {
        let { uid, account } = props && props.data || this.props.data;
        //props 也有可能是mouseover的event对象
        let { type, showModal } = props && props.target ? this.props : ( props || this.props );
        account = account || uid;
        if ( this.inited ) {
            let expiredTime = this.state.expiredTimes[account];
            if ( !!expiredTime && expiredTime > this.now ) {
                return;
            }
        }
        this.inited = true;
        switch ( type ) {
            case userType.focus:
                // this.setState( {
                //     focused: true
                // } );
                // return;
            case userType.follower:
                return sendUserIsFocusedRequest( account ).then( ( { msgId, focused, message } ) => {
                    if ( msgId === MSGIDS.SUCCESS ) {
                        this.setState( {
                            focused,
                            expiredTimes: {
                                ...this.state.expiredTimes,
                                [account]: this.now + 1000 * 10
                            },//10s expired
                            cantClickFocus: false
                        } );
                    } else {
                        console.log( msgId, message );
                        showModal( { text: GET_FOCUS_ERROR + RETRY_LATER } );
                        this.setState( {
                            cantClickFocus: true
                        } );
                    }
                } ).catch( e => {
                    console.log( e );
                    showModal( { text: GET_FOCUS_ERROR + RETRY_LATER } );
                    this.setState( {
                        cantClickFocus: true
                    } );
                } ).finally( () => {

                } );
            case userType.friend:
                return;
            default:
                return;
        }
    }

    /**
     * 关注用户
    */
    focusUser = () => {
        if ( this.focusing ) {
            return;
        }
        this.focusing = true;
        let { showModal, page, type, data: { uid, account } } = this.props;
        //only follower type can enter here
        sendAddFocusedUserRequest( uid || account ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    focused: true
                } )
            } else {
                console.log( msgId, message )
                showModal( { text: FOCUS_ERROR + RETRY_LATER } )
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.focusing = false;
            this.inited = false;
            this.getUserData();
        } );
    }

    /**
     * 取消关注按钮点击处理
    */
    cancelFocusUser = () => {
        if ( this.focusing ) {
            return;
        }
        this.focusing = true;
        let { showModal, page, refreshUsers, type, data: { uid } } = this.props;
        sendDeleteFocusedUserRequest( uid ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                if ( type === userType.focus ) {
                    refreshUsers( { key: type, pageToRefresh: page } );
                } else {
                    this.setState( {
                        focused: false,
                    } );
                }
            } else {
                console.log( msgId, message );
                showModal( { text: CANCEL_FOCUS_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.focusing = false;
            this.inited = false;
            this.getUserData();
        } );
    }

    /**
     * 关注按钮点击处理
    */
    focusClickHandler  = () => {
        let { cantClickFocus, focused } = this.state;
        let { showModal } = this.props;
        if ( cantClickFocus ) {
            return showModal( { text: DATA_ERROR + RETRY_LATER } );
        }
        if ( focused ) {
            return this.cancelFocusUser();
        } else {
            return this.focusUser();
        }
    }

    /**
     * 开始聊天点击处理
    */
    chatClickHandler = () => {
        if( this.chatClicking ) {
            return;
        }
        this.chatClicking = true;
        let { data: { uid }, history } = this.props;
        startChatWith( uid, history ).finally( () => {
            this.chatClicking = false;
        } );
    }

    /**
     * 删除好友点击处理
    */
    deleteClickHandler = () => {
        let { showModal } = this.props;
        showModal( { type: MODAL_CONFIRM, text: DELETE_FRIEND_CONFIRM, callback: this.deleteFriend.bind( this ) } );
    }

    /**
     * 删除好友点击回调
    */
    deleteFriend() {
        if( this.deleteClicking ) {
            return;
        }
        this.deleteClicking = true;
        let { data: { uid }, history } = this.props;
        let { showModal, page, refreshUsers, type } = this.props;
        sendDeleteFriendRequest( uid ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                return refreshUsers( { key: type, pageToRefresh: page } );
            } else {
                console.log( msgId, message );
                showModal( { text: DELETE_FRIEND_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.deleteClicking = false;
        } );
    }

    /**
     * 跳转到对应用户的用户中心
    */
    jumpToUserCenter = () => {
        let { data: { uid }, history } = this.props;
        checkUsersData( [ uid ] ).then( () => {
            history.push( getUserCenterRouter( uid ) );
        } );
    }

    /**
     * 用户列表的item，关注好友粉丝都使用这一个
     * data: {Object} 用户数据
     *     {
     *         name: {String} 名称,
     *         autograph: {String} 个性签名
     *         avatar: {String} 头像链接， 相对路径
     *         uid: {String|Int} 用户account
     *     }
     * num： {Number} 此页用户总数
     * type: {String} 用户类型: 好友、关注、粉丝
    */
    render () {
        let { name = "", autograph = "", avatar = "", uid } = this.props.data;
        let { index, num, type } = this.props;
        let { focused } = this.state;
        let userUID = getUserUID();
        avatar = convertWebp( avatar );
        let noBorder = false;
        noBorder = num % 2 === 0 && ( index === num - 1 || index === num - 2 ) ||
            num % 2 === 1 && ( index === num - 1 );
        return (
            <div className={"uc-userItem-container clear"} style={ noBorder ?  {borderBottom: 0} : undefined } onMouseOver={this.getUserData} >
                <Avatar src={avatar} alt={name} title={name} styles={ this.avatarStyle } />
                <div className="uc-userItem-alias auto-omit" onClick={this.jumpToUserCenter}>{name}</div>
                <div className="uc-userItem-autograph">{autograph}</div>
                { uid == userUID ? false : <div className="uc-user-item-menu">
                    { type !== userType.friend ?
                        <div onClick={this.focusClickHandler} className={"uc-user-item-menu-item " + ( focused ? "cancel-focus-item" : "focus-item" )}></div> // focus item
                        : <Fragment>
                            <div onClick={this.chatClickHandler} className={ "uc-user-item-menu-item chat-item" }></div>
                            <div onClick={this.deleteClickHandler} className={ "uc-user-item-menu-item delete-item" }></div>
                        </Fragment>// friend menu
                    }
                </div> }
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
)( UCUserItem ) );
