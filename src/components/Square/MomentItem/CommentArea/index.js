import React, { Component } from 'react';
import {connect} from "react-redux";
import "./index.css";
import CommentItem from './CommentItem';
import CommentInputArea from './CommentInputArea';
import {sendAddCommentRequest, sendGetHotCommentRequest} from "../../../../requests";
import {getPageNum} from "../../../../util";
import {checkUsersData} from "../../../../util/user";
import {decreaseCommentInProvider, increaseCommentInProvider} from "../../../../redux/actions";
import {MSGIDS} from "../../../../configs/consts";
import {COMMENT_ERROR, GET_COMMENT_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";
class CommentArea extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            text: "",
            comments: [],
            commentPage: this.firstPage,
            inited: false,
            loadend: false
        }
        this.commentEvNum = 10;
    }

    get maxPage() {
        let { moments } = this.props;
        return getPageNum( moments.length, this.commentEvNum );
    }

    get firstPage () {
        return 1;
    }

    /**
     * 隐藏评论时，清空所用state中评论相关的信息，并重置页码
     * 如果每次都显示缓存数据的话，评论数据就不会刷新，除非刷新整个momentProvider,
     * 但是那样刷新后不一定还能找到这个秘圈，所以每次隐藏评论等于刷新评论;
     *
    */
    componentWillReceiveProps( nextProps ) {
        if ( nextProps.show && !this.state.inited ) {
            this.refreshComments();
            this.setState( {
                inited: true
            } );
        }
        if ( !nextProps.show ) {
            this.setState( {
                inited: false,
                commentPage: this.firstPage,
                loadend: false
            } );
        }
    }

    /**
     * 获取评论，添加到state中，并增加页码
     *
    */
    getComments = () => {
        if ( this.state.gettingComments ) {
            return;
        }
        this.setState( {
            gettingComments: true
        } );
        let { mid, showModal } = this.props;
        let { commentPage } = this.state;
        let { request, cancelRequest } = sendGetHotCommentRequest( { mid, page: commentPage } )
        this.cancelGetComments = cancelRequest;
        request.then( ( { msgId, message, comments } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                if ( comments.length === 0 ) {
                    this.setState( {
                        loadend: true
                    } );
                }
                this.checkUsersInComments( comments );
                let newComments = this.state.comments.slice( 0 );
                newComments.push( ...comments )
                this.setState( {
                    comments: newComments,
                    page: ++this.state.commentPage
                } )
            } else {
                showModal( { text: GET_COMMENT_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            if ( !e.message && e.__CANCEL__ ) {//取消请求不提示失败
                return;
            }
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.setState( {
                gettingComments: false
            } );
        } );
    }

    /**
     * 刷新评论，从服务器重新拉数据
    */
    refreshComments () {
        if ( this.state.comments.length !== 0 || this.state.commentPage !== this.firstPage ) {
            this.setState( {
                commentPage: this.firstPage,
                comments: []
            } );
        }
        this.getComments();
    }

    /**
     * 获取评论后，获取评论中涉及的用户的用户资料，走云信
    */
    checkUsersInComments( comments ) {
        let accounts = [];
        comments.forEach( comment => {
            accounts.push( comment.uid );
            let sub_comments = comment.sub_comments;
            if ( !!sub_comments && sub_comments.length > 0 ) {
                sub_comments.forEach( ( { uid } ) => {
                    accounts.push( uid );
                } )
            }
        } );
        checkUsersData( accounts );
    }

    /**
     * 一级评论输入框的changeHandler，和state.text绑定
    */
    changeHandler = ( e ) => {
        this.setState( {
            text: e.target.value
        } )
    }

    /**
     * 重置一级评论输入框中的输入文本
    */
    resetInput = () => {
        this.setState( {
            text: ""
        } )
    }

    /**
     * 增加state中评论的点赞数,子组件中发送请求的成功回调中调用
    */
    thumbsupComment = ( cid ) => {
        let { comments } = this.state,
            comment = comments.find( ( item, i ) => {
            return item.cid === cid
        } );
        if ( !comment ) {
            return;
        }
        comment.is_thumbsup = true;
        comment.thumbsup_number = parseInt( comment.thumbsup_number ) + 1;
        this.setState( {
            comments
        } );
    }

    /**
     * 取消对state中评论的点赞,子组件中发送请求的成功回调中调用
    */
    cancelThumbsupComment = ( cid ) => {
        let { comments } = this.state,
            comment = comments.find( ( item, i ) => {
            return item.cid === cid
        } );
        if ( !comment ) {
            return;
        }
        comment.is_thumbsup = false;
        comment.thumbsup_number = parseInt( comment.thumbsup_number ) - 1;
        this.setState( {
            comments
        } );
    }

    /**
     * 从state中删除该条评论
     * deleteComment: 减少redux中评论的数量，关系到秘圈菜单栏中评论icon后面的数量
    */
    deleteComment = ( cid ) => {
        this.refreshComments();
        let { mid, deleteComment, filter } = this.props;
        deleteComment( mid, filter );
    }

    /**
     * 回复评论，添加一级评论，添加完毕后刷新评论（因为在此期间可能有其他评论被添加）
    */
    responseHandler = ( text ) => {
        if ( this.responsing || text === '' || typeof text !== 'string' ) {
            return;
        }
        this.responsing = true;
        if ( this.state.gettingComments ) {//取消获取更多评论
            !!this.cancelGetComments && this.cancelGetComments();
        }
        let { showModal, mid, addComment, filter } = this.props;
        return sendAddCommentRequest( { comment: text, mid } ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                addComment( mid, filter );
                this.refreshComments();
            } else {
                showModal( { text: COMMENT_ERROR + RETRY_LATER } );
                return Promise.reject( { msgId, message } );
            }
        } ).catch( e => {
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.responsing = false;
        } );
    }

    /**
     * 秘圈评论部分组件
     * show： {Boolean} 是否显示评论部分
     *
    */
    render () {
        let { show, showModal, mid, account, filter } = this.props;
       /**
        * gettingComments: {Boolean} 评论获取请求中
        * loadend: {Boolean} 没有更多评论可供加载，获取更多评论接口中返回评论数为0时设为true
       */
        let { comments, gettingComments, loadend } = this.state;
        if ( !show ) {
            return false;
        }
        let canLoadMore = !gettingComments && !loadend;
        return (
            <div className={'comment-area-container clear'}>
                <div className="input-wrapper clear">
                    <CommentInputArea callback={this.responseHandler}/>
                </div>
                <div className="comment-split-line"></div>
                <div className="comments-wrapper clear">
                    {
                        comments.map( ( v, i ) => <CommentItem filter={filter} deleteComment={this.deleteComment} up={this.thumbsupComment} down={this.cancelThumbsupComment} showModal={showModal} key={i} data={v} /> )
                    }
                    { <div className="comment-loading" style={ canLoadMore? { cursor: "pointer" } : undefined } onClick={ !canLoadMore ?
                        undefined : this.getComments } > { gettingComments ? '加载中...' :
                        loadend ? "没有更多了..." : '加载更多' } </div> }
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        addComment: ( mid, momentType ) => dispatch( increaseCommentInProvider( mid, momentType ) ),
        deleteComment: ( mid, momentType ) => dispatch( decreaseCommentInProvider( mid, momentType ) )
    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( CommentArea );
