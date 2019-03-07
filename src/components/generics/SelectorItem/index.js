import React, { Component } from 'react';
import "./index.css";
import {TEAM,P2P} from "../../../configs/consts";
import {getUserData} from "../../../util";
import {getPersonById} from "../../../redux/store/storeBridge";
import Avatar from '../Avatar';

class SelectorItem extends Component{
    constructor( props ) {
        super( props );
        this.select = this.select.bind( this );
    }

    getData( type, account ) {
        if( type === P2P ) {
            return getUserData( getPersonById( account ) );
        } else {

        }
    }

    select()  {
        this.props.addToSelected( this.props.account );
    }

    /**
     * 好友/群组选择器左半边一条条的item，用于FriendGroup内部
     * account: 当前帐号
     * type: 当前帐号类型： p2p or team
     * selected: 是否已ric被选中
    */
    render () {
        let { account, type, selected } = this.props;
        if( type !== P2P && type !== TEAM ) {
            return false;
        }
        let cur = false;
        if ( !!selected.find( v => account == v ) ) {
            cur = true;
        }
        let { avatar, name } = this.getData( type, account );
        return (
            <div className={"selector-item clear"  + ( cur ? ' cur' : "" )} onClick={this.select}>
                <Avatar classes={['selector-avatar']} src={avatar} />
                <span className="selector-item-name auto-omit">{name}</span>
            </div>
        )
    }
}

export default SelectorItem;
