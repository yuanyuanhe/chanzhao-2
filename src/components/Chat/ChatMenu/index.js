import React, { Component } from 'react';
import { withRouter,NavLink } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css';
import Avatar from '../../generics/Avatar';
import {getUserData} from "../../../util";
import {getPersonById, getUserUID} from "../../../redux/store/storeBridge";
import MenuItem from './MenuItem';
import { MENU_TEAM,MENU_ADD,MENU_FRIEND,MENU_SESSION } from '../../../configs/consts';
import { ICON_TALK_FRIENDS_ACTIVE,ICON_TALK_NEWS_ACTIVE,ICON_TALK_REGISTERED_ACTIVE,ICON_TALK_ADDFRIENDS_ACTIVE } from '../../../configs/iconNames';

const sessionIcon = ICON_TALK_NEWS_ACTIVE.convertIconSrc();
const friendIcon = ICON_TALK_REGISTERED_ACTIVE.convertIconSrc();
const teamIcon = ICON_TALK_FRIENDS_ACTIVE.convertIconSrc();
const addIcon = ICON_TALK_ADDFRIENDS_ACTIVE.convertIconSrc();

class ChatMenu extends Component{
    constructor( props ) {
        super( props );
        this.avatarStyle = {
            width: '60px',
            height: '60px',
            margin: '70px auto 40px'
        };
        this.links = [
            { to: "/chat/session", type: MENU_SESSION, src: sessionIcon },
            { to: "/chat/friend", type: MENU_FRIEND, src: friendIcon },
            { to: "/chat/team", type: MENU_TEAM, src: teamIcon },
            { to: "/chat/add", type: MENU_ADD, src: addIcon },
        ]
    }

    /**
     * 聊天菜单，主要是跳转路由到聊天、好友、群组、添加好友
    */
    render () {
        let uid = getUserUID(),
            userData = getUserData( getPersonById( uid ) );
        return (
            <div className="chat-menu">
                <Avatar src={ userData.avatar } alt="" title="" styles={ this.avatarStyle } />
                { this.links.map( ( v, i ) => {
                    return <MenuItem data={v} key={i}/>
                } ) }
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        userUID: state.userUID,
        user: state.personlist[ state.userUID ]
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( ChatMenu ) );
