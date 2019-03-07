import React, { Component } from 'react';
import "./index.css";
import Avatar from '../../../../generics/Avatar';
import {connect} from "react-redux";
import {getPersonById, isFriend} from "../../../../../redux/store/storeBridge";
import {getUserData} from "../../../../../util";
import {MODAL_CONFIRM, MODAL_PROMPT, MSGIDS, SEX_MALE} from '../../../../../configs/consts'
import {sendAddFriendRequest} from "../../../../../requests";
import {ADD_FRIEND_CONFIRM_TIP, ADD_FRIEND_CONFIRM_TITLE, RETRY_LATER, SEND_ADD_FRIEND_REQUEST_ERROR, SEND_ADD_FRIEND_REQUEST_SUCCESS} from "../../../../../configs/TIP_TEXTS";

let src = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1608677444,1206227043&fm=27&gp=0.jpg?x-oss-process=image/format,webp';
class MemberProfile extends Component{
    constructor( props ) {
        super( props );
        this.addFriend = this.addFriend.bind( this );
    }

    addFriendHandler = () => {
       let { account, showModal } = this.props;
        showModal( {type: MODAL_PROMPT, text: ADD_FRIEND_CONFIRM_TIP, title: ADD_FRIEND_CONFIRM_TITLE, callback: this.addFriend.bind( null, account )} );
    }

    addFriend = ( account, message ) => {
        let { showModal } = this.props;
        sendAddFriendRequest( account, message ).then( ( { msgId } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: SEND_ADD_FRIEND_REQUEST_SUCCESS } );
            } else {
                showModal( { text: SEND_ADD_FRIEND_REQUEST_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e )
            showModal( { text: RETRY_LATER } );
        } );
    }

    /**
     * 群成员资料简介
     * 非好友显示添加好友按钮 点击后弹出添加好友弹框
    */
    render () {
        let { account, userUID } = this.props;
        if ( !account ) {
            return false;
        }
        let { alias = "人", avatar = src,mt_number = '123', sex = '女', age, area } = getUserData( getPersonById( account ) ),
            userIsFriend = isFriend( account ) || account == userUID;
        sex = sex === SEX_MALE ? "male" : "female"
        return (
            <div className={'member-profile-container clear shadow' + ( userIsFriend ? " isFriend" : "" )}>
                <Avatar classes={['member-profile-avatar']} src={avatar}/>
                <div className="member-profile-alias auto-omit">{alias}</div>
                <div className="member-profile-mt-number">{mt_number} <span className={"member-profile-sex " + sex }></span></div>
                <div className="member-profile-datas">
                    <div className="member-profile-item">
                        <div className="member-profile-key">年龄</div>
                        <div className="member-profile-value auto-omit">{age}</div>
                    </div>
                    <div className="member-profile-item">
                        <div className="member-profile-key">地区</div>
                        <div className="member-profile-value auto-omit">{area}</div>
                    </div>
                </div>
                { !!userIsFriend ? false :
                      <div className={"member-profile-add-friend"} onClick={this.addFriendHandler}>加好友</div>
                }
            </div>
        )
    }
}

function mapStateToProps( props ) {
    return {
        personlist: props.personlist,
        friendlist: props.friendlist,
        userUID: props.userUID
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( MemberProfile );