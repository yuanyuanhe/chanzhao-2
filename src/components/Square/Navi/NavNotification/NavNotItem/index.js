import React, { Component } from 'react';
import "./index.css";
import {getRepostParams, getUserData} from "../../../../../util";
import CommentItem from './CommentItem';
import ThumbupItem from './ThumbupItem';
import TransportItem from './TransportItem';
import {getPersonById} from "../../../../../redux/store/storeBridge";
class NavNotItem extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 获取导航条系统通知组件
    */
    getInner( data ) {
        let { type, user: { uid }, moment, create_time } = data,
            { avatar, name } = getUserData( getPersonById( uid ) );
        switch ( type ) {
            case 2:
                //秘圈被点赞通知
                return <ThumbupItem time={create_time} uid={uid} moment={moment}/>;
            case 3:
                //秘圈被评论通知
                return <CommentItem time={create_time} cid={data.cid} comment={data.comment} uid={uid} moment={moment}/>;
            case 4:
                //秘圈被转发通知
                return <TransportItem time={create_time} uid={uid} moment={moment}/>;
        }
    }

    /**
     * 通知item
     * data: {Object} 系统通知，具体数据结构见line:13 getInner方法
    */
    render () {
        let { data } = this.props;
        return (
            <div className={'nav-not-item clear'}>
                { this.getInner( data ) }
            </div>
        )
    }
}

export default NavNotItem;
