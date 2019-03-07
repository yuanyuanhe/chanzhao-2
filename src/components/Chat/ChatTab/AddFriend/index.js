import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import TabSearch from '../TabSearch';
import {sendSearchUserRequest} from "../../../../requests";
import TabItem from '../TabItem';
import ScrollContainer from '../../../generics/ScrollContainer';
import {store} from "../../../../redux/store";
import {allowFriendshipApply, setSearchResult} from "../../../../redux/actions";
import $ from "jquery";
import {AddResize, setHeight} from "../index";
import FriendshipApplyItem from './FriendshipApplyItem';
import {MSGIDS} from "../../../../configs/consts";
import {REQUEST_ERROR} from "../../../../configs/TIP_TEXTS";

const tagClassName = 'tab-add-list';
class AddFriend extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            words: "",
            curId: ""
        }
        this.onChange = this.onChange.bind( this );
        this.resetHeight = this.resetHeight.bind( this );
        this.resetCurId = this.resetCurId.bind( this );
    }

    /**
     * 根据viewport大小重置面板高度
    */
    resetHeight( node ) {
        if ( !node ) {
            $( window ).off( AddResize );
            return;
        }
        $( window ).on( AddResize, setHeight( tagClassName, node ) );
    }

    componentDidMount () {
        $(window).resize();
    }

    /**
     * 修改搜索关键字
    */
    onChange( e ) {
        let words = e.target.value;
        let { showModal } = this.props;
        this.setState( {
            words,
            curId: ""
        } );
        if ( words === "" ) {
            this.props.setUsers( [] );
            return;
        }
        sendSearchUserRequest( words.split( '/' ).join( '' ) ).then( ( { msgId, users } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.props.setUsers( users );
            } else {
                showModal( { text: REQUEST_ERROR } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } );
    }

    /**
     * 重置当前选中的item
    */
    resetCurId( account ) {
        this.setState( {
            curId: account
        } );
    }

    /**
     * 获取搜索结果item
    */
    searchResult( users, classes ) {
        let { curId } = this.state;
        return users.map( ( v, i ) => {
            let { name, uid, avatar } = v,
                to = `/chat/add/${uid}`;
            avatar = avatar.convertSrcWebp();
            return <TabItem account={uid} resetCurId={this.resetCurId} curId={curId} name={name} to={to} avatar={avatar} classes={classes} key={i} />
        } )
    }

    /**
     * 如果没有搜索关键字，则展示登录期间接收到的好友申请
     * friendshipApplies： {Array} 登录期间接收到的好友申请
    */
    applies() {
        let { friendshipApplies, showModal } = this.props;
        return friendshipApplies.map( ( v, i ) => {
            return <FriendshipApplyItem showModal={showModal} data={v} key={i}/>
        } );
    }

    /**
     * 添加好友面板
     * users: {Array} 搜索到的好友数组
    */
    render () {
        let { words } = this.state,
            { users } = this.props;
        let classes = [ 'chat-friend-item' ];
        let main;
        if ( words !== "" ) {
            main = this.searchResult( users, classes );
        } else {
            main = this.applies();
        }

        return (
            <div>
                <TabSearch words={words} changeHandler={this.onChange} placeholder={"请输入昵称手机号或秘图号"} />
                <div className={'tab-list-wrapper ' + tagClassName} ref={this.resetHeight}>
                    <ScrollContainer>
                        { main }
                    </ScrollContainer>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        users: state.searchResult,
        friendshipApplies: state.friendshipApplies
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        setUsers: ( users ) => dispatch( setSearchResult( users ) ),
        allowFriendshipApply: ( uid ) => dispatch( allowFriendshipApply( uid ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( AddFriend ) );
