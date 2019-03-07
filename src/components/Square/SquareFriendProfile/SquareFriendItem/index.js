import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {personlist} from "../../../../redux/reducers/people";
import {getUserCenterRouter, getUserData} from "../../../../util";
import {getPersonById} from "../../../../redux/store/storeBridge";
import Avatar from '../../../generics/Avatar';
class SquareFriendItem extends Component{
    constructor( props ) {
        super( props );
    }

    componentWillMount() {

    }

    enterFriendsUserCenter = () => {
        let { data: { account }, history } = this.props;
        //square/userCenter/741/moments/user
        history.push( `/square/userCenter/${account}/moments/user` );
    }

    /**
     * 好友item组件，点击进入该用户用户中心
    */
    render () {
        let { data: { account } } = this.props;
        let { avatar, alias } = getUserData( getPersonById( account ) );
        return (
            <div className={'square-friend-item clear'} onClick={this.enterFriendsUserCenter}>
                <Avatar src={avatar} title={alias} alt={alias} classes={['sfi-avatar']}/>
                <div className="sfi-alias auto-omit">{alias || " "}</div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist,
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
)( SquareFriendItem ) );
