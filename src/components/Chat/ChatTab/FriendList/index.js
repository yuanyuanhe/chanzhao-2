import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getFriends, getPersonById, getUserUID} from "../../../../redux/store/storeBridge";
import {getFriendNameList, getNameGroups, getPinYin, getUserData} from "../../../../util";
import FriendGroup from "./FriendGroup";
import TabSearch from "../TabSearch";
import TabItem from '../TabItem';
import ScrollContainer from '../../../generics/ScrollContainer';
import {P2P} from "../../../../configs/consts";
import { setHeight, FriendResize } from "../index";
import $ from "jquery";

const tagClassName = 'tab-friend-list';
class FriendList extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            words: ""
        }
        this.onChange = this.onChange.bind( this );
        this.resetSearch = this.resetSearch.bind( this );
        this.resetHeight = this.resetHeight.bind( this );
    }

    /**
     * 根据viewport大小重置面板高度
    */
    resetHeight( node ) {
        if ( !node ) {
            $( window ).off( FriendResize );
            return;
        }
        $( window ).on( FriendResize, setHeight( tagClassName, node ) );
    }

    componentDidMount () {
        $(window).resize();
    }

    /**
     * search input changeHandler
    */
    onChange( e ) {
        let words = e.target.value;
        this.setState({
            words
        });
        if ( words === "" ) {
            return;
        }
        //search user
    }

    /**
     * 重置搜索关键字
    */
    resetSearch() {
        if ( this.state.words === "" ) {
            return;
        }
        this.setState( {
            words: ""
        } );
    }

    /**
     * 非搜索状态，自己的item需要置顶
    */
    getTopPart () {
        let classes = [ 'chat-friend-item', 'chat-my-item' ],
            { userUID } = this.props,
            { resetSearch } = this.props,
            { name, avatar } = getUserData( getPersonById( userUID ) ),
            to = `/chat/friend/${userUID}`;
        avatar = !!avatar && avatar.convertSrcWebp() || "";
        return <TabItem account={userUID} scene={P2P} to={to} resetSearch={resetSearch} name={name} classes={classes} avatar={avatar} />
    }

    /**
     * 按首字母分组显示通讯录
    */
    getGroup() {
        let group = getNameGroups( getFriendNameList( this.props.friends ));
        return group.map( ( v, i ) => {
            if ( v.accounts.length === 0 ) {
                return false;
            }
            return <FriendGroup data={v} key={i} resetSearch={this.resetSearch} />
        } );
    }

    /**
     * 根据关键字搜索到的结果渲染friend list
    */
    getSearchResult( words ) {
        //search from friends
        let searchKey = getPinYin( words ).toLowerCase(),
            { friends } = this.props,
            accounts = [];
        friends.forEach( ({ account }) => {
            let { alias, name } = getUserData( getPersonById( account ) );
            if ( ~getPinYin( alias ).toLowerCase().indexOf( searchKey ) || ~getPinYin( name ).toLowerCase().indexOf( searchKey ) ) {
                accounts.push( account );
            }
        } );
        let classes = ['chat-friend-item'];
        return accounts.map( ( v, i ) => {
            let { name, avatar } = getUserData( getPersonById( v ) );
            let to = `/chat/friend/${v}`;
            avatar = avatar.convertSrcWebp();
            return (<TabItem account={v} scene={P2P} to={to} name={name} classes={classes} avatar={avatar} key={i} resetSearch={this.resetSearch}/>)
        } )
    }

    /**
     * 通讯录好友tab list
    */
    render () {
        let { words } = this.state,
            top,
            main;
        if ( words === "" ) {
            main = this.getGroup();
            top = this.getTopPart();
        } else {
            main = this.getSearchResult( words );
            top = false;
        }
        return (
            <div className={"chat-friend-list-container"}>
                <TabSearch words={this.state.words} changeHandler={this.onChange} placeholder={"请输入昵称手机号或秘图号"} />
                <div className={"tab-list-wrapper " + tagClassName} ref={this.resetHeight}>
                    <ScrollContainer>
                        { top }
                        { main }
                    </ScrollContainer>
                </div>

            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        userUID: state.userUID,
        friends: state.friendlist
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( FriendList ) );
