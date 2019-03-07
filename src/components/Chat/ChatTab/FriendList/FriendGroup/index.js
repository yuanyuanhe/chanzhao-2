import React, { Component } from 'react';
import "./index.css";
import {getPersonById, getTeamById} from "../../../../../redux/store/storeBridge";
import {getUserData} from "../../../../../util";
import TabItem from '../../TabItem';
import {P2P} from "../../../../../configs/consts";
class FriendGroup extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 好友通讯录左侧面板，按首字母分组的组件
     * data: {Object} 此分组数据
     *     {
     *         key: {String} 分组组名（AZ其他）
     *         accounts: {Array} 此分组所有的好友帐号
     *     }
    */
    render () {
        let classes = ['chat-friend-item'];
        let { key, accounts } = this.props.data;
        let resetSearch = this.props.resetSearch;
        if ( accounts.length === 0 ) {
            return false;
        }
        return (
            <div className={"chat-friend-group"}>
                <div className={"chat-tab-type-item chat-friend-type"}>{key.toUpperCase()}</div>
                {accounts.map( ( v, i ) => {
                    let { name, avatar } = getUserData( getPersonById( v ) );
                    let to = `/chat/friend/${v}`;
                    avatar = avatar.convertSrcWebp();
                    return <TabItem account={v} scene={P2P} classes={classes} name={name} avatar={ avatar } to={ to } key={ i } resetSearch={resetSearch} />
                } )}
            </div>
        )
    }
}

export default FriendGroup;
