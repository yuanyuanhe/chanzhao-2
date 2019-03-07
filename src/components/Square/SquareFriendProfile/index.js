import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {friendlist} from "../../../redux/reducers/friends";
import SquareFriendItem from './SquareFriendItem';
import {checkUsersData} from "../../../util/user";
import JumpArrow from '../../generics/JumpArrow';
import SubTitle from '../../generics/SubTitle';
import { ICON_SQUARE_MYFRIENDS } from '../../../configs/iconNames';
class SquareFriendProfile extends Component{
    constructor( props ) {
        super( props );
        this.friendShowNumLimit = 10;
    }

    /**
     * 同步所有好友用户数据
    */
    componentWillMount() {
        let { friendlist } = this.props,
            accounts = [];
        friendlist.forEach( ( { account } ) => accounts.push( account ) );
        checkUsersData( accounts );
    }

    /**
     * 广场首页右侧好友列表部分
    */
    render () {
        let { friendlist, uid } = this.props,
            to = `/square/userCenter/${uid}/users/friend`;

        return (
            <div className={'sqaure-friend-profile-container clear shadow'}>
                <SubTitle classes={['sfp-header']} iconSrc={ICON_SQUARE_MYFRIENDS} to={to}>
                    我的好友<span className="sfp-num">({friendlist.length})</span>
                </SubTitle>
                { friendlist.slice( 0, this.friendShowNumLimit ).map( ( v, i ) => <SquareFriendItem key={i} data={v} /> ) }
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        uid: state.userUID,
        friendlist: state.friendlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( SquareFriendProfile ) );
