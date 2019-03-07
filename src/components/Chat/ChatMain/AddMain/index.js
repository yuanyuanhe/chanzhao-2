import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import SamePart from '../SamePart';
import {ICON_NEWFRIEND_CIRCLE, ICON_NEWFRIEND_TALK,ICON_NEWFRIEND_ADD} from "../../../../configs/iconNames";
import {MALE_NUM, MODAL_PROMPT, MSGIDS, SEX_FEMALE, SEX_MALE} from "../../../../configs/consts";
import {checkUsersData} from "../../../../util/user";
import { sendAddFriendRequest } from "../../../../requests";
import {ADD_FRIEND_CONFIRM_TIP, ADD_FRIEND_CONFIRM_TITLE, REQUEST_ERROR, RETRY_LATER, SEND_ADD_FRIEND_REQUEST_ERROR, SEND_ADD_FRIEND_REQUEST_SUCCESS} from "../../../../configs/TIP_TEXTS";

const squareIcon = ICON_NEWFRIEND_CIRCLE.convertIconSrc();
// const talkIcon = ICON_NEWFRIEND_TALK.convertIconSrc();
const addIcon = ICON_NEWFRIEND_ADD.convertIconSrc();
const maleSex = SEX_MALE;
class AddMain extends Component{
    constructor( props ) {
        super( props );
        this.showAddFriendVerify = this.showAddFriendVerify.bind( this );
        this.jumpToUserCenter = this.jumpToUserCenter.bind( this );
        this.profiles = [
           {
                key: "sex",
                value: "",
                text: "性别"
            }, {
                key: "mt_number",
                value: "",
                text: "秘图号"
            }
        ]
    }

    getUser( account ) {
        let { users } = this.props;
        return users.find( v => {
            return v.uid == account
        } ) || {};
    }

    /**
     * 点击添加好友anchor后，弹出填写备注信息的弹框
    */
    showAddFriendVerify() {
        let { match: { params: { account } }, showModal } = this.props;
        showModal( {type: MODAL_PROMPT, text: ADD_FRIEND_CONFIRM_TIP, title: ADD_FRIEND_CONFIRM_TITLE, callback: this.addFriend.bind( this, account )} );
    }

    addFriend( account, message ) {
        let { showModal } = this.props;
            sendAddFriendRequest( account, message ).then( ( { msgId } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: SEND_ADD_FRIEND_REQUEST_SUCCESS } );
            } else {
                showModal( { text: SEND_ADD_FRIEND_REQUEST_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e )
            showModal( { text: REQUEST_ERROR } );
        } );
    }

    jumpToUserCenter() {
        let { account } = this.props.match.params;
        checkUsersData( [ account ] );
        this.props.history.replace( `/square/userCenter/${account}/users/focus` );
    }

    getProfiles() {
        let { account } = this.props.match.params,
            data = this.getUser( account );
        data.sex = data.sex == MALE_NUM ? SEX_MALE : SEX_FEMALE;
        this.profiles.forEach( v => {
            v.value = data[ v.key ]
        } );
        return this.profiles;
    }

    getAnchors() {
        let { account } = this.props.match.params;

        return [
            {
                src: addIcon,
                clickHandler: this.showAddFriendVerify
            },{
                src: squareIcon,
                clickHandler: this.jumpToUserCenter
            }
            // ,{
            //     src: talkIcon,
            //     clickHandler: this.startChat
            // }
        ]

    }

    /**
     * 添加好友部分主面板
     * 复用SamePart组件
    */
    render () {
        let { account } = this.props.match.params;
        let { name, avatar, sex } = this.getUser( account );
        !!avatar  && ( avatar = avatar.convertSrcWebp() );
        let anchors = this.getAnchors(),
            profiles = this.getProfiles();
        sex = sex == MALE_NUM ? SEX_MALE : SEX_FEMALE;
        return (
            <div className={"chat-add-main"}>
                <SamePart name={name} avatar={avatar}  sex={sex} anchors={anchors} profiles={profiles} >
                    <div className="split-line"></div>
                </SamePart>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        users: state.searchResult
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( AddMain ) );
