import React, { Component } from 'react';
import "./index.css";
import Avatar from '../../../../generics/Avatar'
import {getPersonById, getUserUID} from "../../../../../redux/store/storeBridge";
import {getUserData, transTime2} from "../../../../../util";
import ResponseArea from './ResponseArea';
import CommentInputArea from '../CommentInputArea';
import CommentContent from '../CommentContent';
import {sendAddCommentRequest, sendCancelThumbsupCommentRequest, sendDeleteCommentRequest, sendThumbsupCommentRequest} from "../../../../../requests";
import {MODAL_CONFIRM, MSGIDS} from "../../../../../configs/consts";
import {CANCEL_THUMB_UP_FAIL, DELETE_COMMENT_CONFIRM, DELETE_COMMENT_ERROR, REQUEST_ERROR, RETRY_LATER, THUMB_UP_FAIL} from "../../../../../configs/TIP_TEXTS";
// import {ICON_CIRCLE_LIKE_COMMON,ICON_CIRCLE_LIKE_ACTIVE} from '../../../../../configs/iconNames';
class CommentItem extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showResponse: false,
            startResponse: false
        }
    }

    /**
     * 二级评论显隐
    */
    toggleResponse = () => {
        this.setState( {
            showResponse: !this.state.showResponse
        } );
    }

    /**
     * 回复/取消回复按钮点击处理
    */
    responseHandler = () => {
        this.setState( {
            startResponse: !this.state.startResponse
        } );
    }

    /**
     * 隐藏回复部分
    */
    hideResponse = () => {
        this.setState( {
            startResponse: false
        } );
    }

    /**
     * 点赞评论icon点击处理
     * up, down: 添加一级评论中评论的被赞数(一级评论所有数据保存在CommentArea组件中)，此组件不可改变comment的数据
    */
    thumbsComment = () => {
        if ( this.isThumbing ) {
            return;
        }
        this.isThumbing = true;
        let { up, down, showModal } = this.props;
        let { mid, cid, is_thumbsup } = this.props.data;
        if ( is_thumbsup ) {
            sendCancelThumbsupCommentRequest( { mid, cid } ).then( ( { msgId, message } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    down( cid );
                } else {
                    showModal( { text: CANCEL_THUMB_UP_FAIL + RETRY_LATER } );
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.isThumbing = false;
            } );
        } else {
            sendThumbsupCommentRequest( { mid, cid } ).then( ( { msgId, message } ) => {
                if ( msgId === '200' ) {
                    up( cid );
                } else {
                    showModal( { text: THUMB_UP_FAIL + RETRY_LATER } );
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } ).finally( () => {
                this.isThumbing = false;
            } );
        }
    }

    /**
     * 删除评论icon点击处理方法
    */
    deleteCommentHandler = ( cid ) => {
        let { uid, mid } = this.props.data,
            { showModal } = this.props,
            userUID = getUserUID();
        if ( uid == userUID ) {
            showModal( { type: MODAL_CONFIRM, text: DELETE_COMMENT_CONFIRM, callback: this.deleteComment.bind( this, { cid, uid, mid } ) } )
        }
    }

    /**
     * 删除state中的评论数，并减少秘圈的评论数数目
     * deleteComment： 减少redux中此条秘圈的评论数目，秘圈评论数是一级和二级评论数目的总和
    */
    deleteComment ( { cid, uid, mid } ) {
        if ( this.deletingComment ) {
            return;
        }
        this.deletingComment = true;
        let { showModal, deleteComment } = this.props;
        sendDeleteCommentRequest( { cid, mid } ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                !!deleteComment && deleteComment( cid );
            } else {
                showModal( { text: DELETE_COMMENT_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.deletingComment = false;
        } )
    }

    /**
     * 一級评论组件
     * data： {Object} 服务器返回的评论数据
     *     {
     *         uid: {String|Number}评论人帐号
     *         sub_comments: {Array} 子评论数组
     *         comment: {String} 评论文本
     *         comment_time: {String} 格式化好的评论时间文本
     *         comment_number: {Number} 子评论数量
     *         mid: 评论所在mid
     *         cid: 此条comment的id
     *         is_thumbup: {Boolean} 用户是否点赞了这条评论
     *         thumbup_number: {Number} 评论被点赞的数量
     *     }
    */
    render () {
        let { uid, sub_comments, comment, comment_time,  comment_number, mid, cid, is_thumbsup, thumbsup_number } = this.props.data;
        let { showModal, filter } = this.props;
        let userUID = getUserUID();
        let { avatar, alias } = getUserData( getPersonById( uid ) );
        let { startResponse } = this.state;
        let time = transTime2( comment_time );
        return (
            <div className={'comment-item-wrapper clear'}>
                <CommentContent uid={uid} deleteComment={this.deleteCommentHandler} cid={cid} avatar={avatar} name={alias} text={comment} time={comment_time}>
                    <div className="comment-menu">
                        <span className="comment-menu-item item-response" onClick={this.responseHandler}>{ startResponse ? "取消" : "回复" }</span>
                        <span onClick={this.thumbsComment} className={ "comment-menu-item item-thumbup " + ( is_thumbsup ? 'cur' : "" ) }>
                            （{thumbsup_number}）
                        </span>
                    </div>
                </CommentContent>
                { <ResponseArea filter={filter} hideResponse={this.hideResponse} startResponse={startResponse} showModal={showModal} uid={uid} mid={mid} cid={cid} sum={comment_number} responses={sub_comments}/> }
            </div>
        )
    }
}

export default CommentItem;
