import React, { Component } from 'react';
import {connect} from "react-redux";
import "./index.css";
import {allowFriendshipApply} from "../../../../../redux/actions";
import {getMtsdk, getPersonById} from "../../../../../redux/store/storeBridge";
import {getUserData} from "../../../../../util";
import Avatar from '../../../../generics/Avatar';
import {REQUEST_ERROR} from "../../../../../configs/TIP_TEXTS";

const ALLOW = '同意';
const ALLOWED = '已同意';
class FriendshipApplyItem extends Component{
    constructor( props ) {
        super( props );
        this.allowApply = this.allowApply.bind( this );
    }

    allowApply( e ) {
        e.preventDefault();
        let { allowFriendshipApply, data: { account, ps, idServer, allowed }, showModal } = this.props;
        if ( allowed ) {
            return;
        }
        let mtsdk = getMtsdk();
        mtsdk.passFriendApply( { ps, account, idServer } ).then( ( { friend } ) => {
            mtsdk.onAddFriend( friend );
            allowFriendshipApply( account );
        } ).catch( e => {
            showModal( { text: REQUEST_ERROR } );
            console.log( e );
        } );
    }

    /**
     * 好友申请item
     * data: {Object} 申请数据
     *     {
     *         account: {Number} 申请人帐号
     *         allowes: {Boolean} 是否已同意
     *         ps: {String} 备注
     *     }
    */
    render () {
        let { data: { account, allowed, ps } } = this.props;
        let { alias, avatar } = getUserData( getPersonById( account ) );
        return (
            <div className={"chat-tab-item apply-item"}>
                <Avatar src={avatar} title={alias} alt={alias} classes={['tab-item-avatar']} />
                <div className="chat-apply-alias auto-omit">{ alias }</div>
                <div className="chat-apply-text auto-omit">{ ps }</div>
                <button onClick={this.allowApply} className={ 'friendship-allow-submit ' + ( allowed ? "allowed" : "" ) }>{ allowed ? ALLOWED: ALLOW }</button>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        friendshipApplies: state.friendshipApplies,
        friendlist: state.friendlist,
        personlist: state.personlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        allowFriendshipApply: ( uid ) => dispatch( allowFriendshipApply( uid ) )
    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( FriendshipApplyItem );
