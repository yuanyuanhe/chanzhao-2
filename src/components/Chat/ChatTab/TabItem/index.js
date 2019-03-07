import React, { Component } from 'react';
import "./index.css";
import {Link, withRouter} from 'react-router-dom';
import Avatar from '../../../generics/Avatar';
import {connect} from "react-redux";
import {CHATTING_HISTORY, MEMBER_LSIT, P2P, TEAM} from "../../../../configs/consts";
import {offSwitch, setFriendTabId, setTeamTabId} from "../../../../redux/actions";

class TabItem extends Component{
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
    }

    /**
     * item点击处理方法
     * checkdata: {Function} 检测item对应的帐号数据是否已同步，未同步则同步数据
     * resetSearch: {Function} 重置搜索关键字
     * account: {String|Number} 帐号
     * scene: {String} 场景
     * resetCurId: {Function} 重置当前选中的item id
    */
    clickHandler() {
        let { checkdata, resetSearch, account = '', scene = '', resetCurId } = this.props;
        !!checkdata && checkdata( account );
        !!resetSearch && resetSearch();
        !!resetCurId && resetCurId( account );
        !!scene && ( scene === P2P && this.props.setFID( account ) || scene === TEAM && this.props.setTID( account ) );
        !!scene && scene === TEAM && this.props.offMemberlist();
        this.props.history.replace( this.props.to );
    }

    getClass( classes ) {
        if ( !classes || classes.length === 0 ) {
            return "";
        }
        return " " + classes.join( " " );
    }

    /**
     * 聊天左侧tab 通用item（除了session）
     * account: {String|Number} item 帐号，群组好友都可能
     * classes: {Array} 引用组件时自定义样式用css类名数组
     * name: {String} item名称展示区的名称
     * avatar: {String} 头像链接
     * to: {String} 需要跳转到的路由地址
     * resetSearch: {Function} 重置搜索关键字方法
     * friendTabId: {String} redux中当前选中的friend tab item id
     * teamTabId: {String} redux中当前选中的team tab item id
     * curId: {String} 添加好友面板中选中的用户id
    */
    render () {
        let { account, classes, name, avatar, to, resetSearch, friendTabId, teamTabId, curId } = this.props;
        let cur = !!account && ( account == friendTabId || account == teamTabId || account == curId ) ? " tab-item-cur" : ""
        return (
            <div className={ "chat-tab-item" + this.getClass( classes ) + cur } onClick={ this.clickHandler }>
                <Avatar classes={['tab-item-avatar']} src={avatar} title={name} alt={name} />
                <a onClick={() => void 0}>
                    {name}
                </a>
            </div>

        )
    }
}

function mapStateToProps( state ) {
    return {
        friendTabId: state.friendTabId,
        teamTabId: state.teamTabId
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        setFID: ( fid ) => dispatch( setFriendTabId( fid ) ),
        setTID: ( teamId ) => dispatch( setTeamTabId( teamId ) ),
        offMemberlist: () => dispatch( offSwitch( MEMBER_LSIT ) )
    }
}


export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( TabItem ) );
