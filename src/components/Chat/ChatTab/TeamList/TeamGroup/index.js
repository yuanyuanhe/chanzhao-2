import React, { Component } from 'react';
import "./index.css";
import TabItem from '../../TabItem';
import { getTeamAvatar, getTeamById} from "../../../../../redux/store/storeBridge";
import {checkTeamMemberUserData} from "../../../../../util/user";
import { TEAM } from "../../../../../configs/consts";

class TeamGroup extends Component{
    constructor( props ) {
        super( props );
    }

    checkTeamData( teamId ) {
        checkTeamMemberUserData( teamId );
    }

    /**
     * 群组通讯录分组组件
     * data: {Object} 分组数据
     *     {
     *         key: {String} 分组key（A_Z其他）
     *         accounts: {Array} 分组所有帐号数组
     *     }
    */
    render () {
        let { key, accounts } = this.props.data;
        if ( accounts.length === 0 ) {
            return false;
        }
        let classes = ['chat-team-item'];
        return (
            <div className={"chat-team-group"}>
                <div className={"chat-tab-type-item chat-team-type"}>{key.toUpperCase()}</div>
                {accounts.map( ( v, i ) => {
                    let { name } = getTeamById( v );
                    let to = `/chat/team/${v}`;
                    let avatar = getTeamAvatar( v );
                    return <TabItem scene={TEAM} account={v} checkdata={this.checkTeamData} name={name} to={to} avatar={avatar} classes={classes} key={i} />
                } )}
            </div>
        )
    }
}

export default TeamGroup;
