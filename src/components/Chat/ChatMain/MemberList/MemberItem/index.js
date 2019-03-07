import React, { Component } from 'react';
import "./index.css";
import {getNickInTeam, getPersonById} from "../../../../../redux/store/storeBridge";
import Avatar from '../../../../generics/Avatar';
import {getUserData} from "../../../../../util";

let src = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1608677444,1206227043&fm=27&gp=0.jpg?x-oss-process=image/format,webp';
class MemberItem extends Component{
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
    }

    clickHandler() {
        this.props.changeCur( this.props.data.account )
    }

    /**
     * 群组成员item
    */
    render () {
        let { teamId, data: { account }, cur } = this.props,
            { avatar, name } = getUserData( getPersonById( account ) ) || { name: account  + "-123" },
            nickInTeam = getNickInTeam( account, teamId ) || name;
        let curClass = !cur ? "" : cur != account ? "" : ' cur'
        return (
            <div className={'memeber-item-container clear' + curClass} onMouseEnter={this.clickHandler}>
                <Avatar src={ avatar } classes={['member-avatar']}/>
                <div className="member-name auto-omit">{ nickInTeam }</div>
            </div>
        )
    }
}

export default MemberItem;
