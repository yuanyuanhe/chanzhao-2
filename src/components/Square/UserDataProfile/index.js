import React, { Component } from 'react';
import "./index.css";
import {getPersonById, getUserUID} from "../../../redux/store/storeBridge";
import {getUserData} from "../../../util";
import Avatar from '../../generics/Avatar';
import SexAndNumber from '../../generics/SexAndNumber';
import {MSGIDS, SEX_MALE} from "../../../configs/consts";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {personlist} from "../../../redux/reducers/people";
import {sendGetFocusUserAndFollowerNumRequest} from "../../../requests";
//icon_presonal_homepage
class UserDataProfile extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            focusNum: 0,
            followerNum: 0
        }
    }

    componentWillMount() {
        //get fans & focus
        let { uid, showModal } = this.props;
        sendGetFocusUserAndFollowerNumRequest( uid ).then( res => {
            if ( res.msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    focusNum: res.focusUser,
                    followerNum: res.follower
                } );
            }
        } ).catch( e => {
            console.log( e );
        } );
    }

    jumpToBrowserFocusers = () => {
        let { history, uid } = this.props;
        this.props.history.push( `/square/userCenter/${uid}/users/focus` )
    }

    jumpToBrowserFollowers = () => {
        let { history, uid } = this.props;
        history.push( `/square/userCenter/${uid}/users/follower` );
    }

    /**
     * 广场首页右上角 用户信息组件
     *
    */
    render () {
        let { uid } = this.props,
            { mt_number, name, sex, autograph, avatar } = getUserData( getPersonById( uid ) ),
            { focusNum, followerNum } = this.state;
        return (
            <div className={'user-data-profile-container clear shadow'}>
                <div className="udp-user-part clear">
                    <Avatar src={avatar} alt={name} title={name} classes={['udp-avatar']}/>
                    <div className="udp-name auto-omit">{ name || "unnamed" }</div>
                    <div className="udp-line">
                        <SexAndNumber sex={sex} number={mt_number}/>
                    </div>
                    <div className="udp-autograph auto-omit">{ autograph || " " }</div>
                </div>
                <div className="udp-data-part clear">
                    <div className="udp-dpi" onClick={this.jumpToBrowserFocusers}>
                        <div className="udp-dpi-num auto-omit">{focusNum}</div>
                        <div className="udp-dpi-text">{"关注"}</div>
                    </div>
                    <div className="udp-dpi" onClick={this.jumpToBrowserFollowers}>
                        <div className="udp-dpi-num auto-omit">{followerNum}</div>
                        <div className="udp-dpi-text">{"粉丝"}</div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        uid: state.userUID,
        personlist: state.personlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( UserDataProfile ) );
