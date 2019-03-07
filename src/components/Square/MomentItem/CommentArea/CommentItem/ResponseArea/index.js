import React, { Component, Fragment } from 'react';
import "./index.css";
import Avatar from '../../../../../generics/Avatar';
import {getUserData} from "../../../../../../util";
import {getPersonById, getUserUID} from "../../../../../../redux/store/storeBridge";
import {sendAddCommentRequest, sendDeleteCommentRequest, sendGetSubCommentOfHotCommentRequest} from "../../../../../../requests";
import {checkUsersData} from "../../../../../../util/user";
import {connect} from "react-redux";
import CommentContent from '../../CommentContent';
import CommentInputArea from '../../CommentInputArea';
import {MODAL_CONFIRM, MSGIDS} from "../../../../../../configs/consts";
import {decreaseCommentInProvider, increaseCommentInProvider} from "../../../../../../redux/actions";
import {GET_RESPONSE_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../../../configs/TIP_TEXTS";
class ResponseArea extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            subComments: undefined,
            loadend: false,
            page: this.firstPage,
            showSubComments: false
        }
    }

    get firstPage () {
        return 1;
    }

    /**
     * 回复按钮点击处理方法
     * 回复后增加redux中此秘圈的评论数然后刷新二级评论
    */
    reponseCommentHandler = ( text ) => {
        if ( text === "" || this.responsing || typeof text !== 'string' ) {
            return;
        }
        if ( this.state.isLoading ) {//回复时取消获取更多评论的请求
            !!this.cancelGetSubComments && this.cancelGetSubComments();
        }
        let { hideResponse, showModal, mid, cid, uid , filter, addComment } = this.props;
        let params = { comment: text, mid, to_cid: cid, to_user: uid };
        return sendAddCommentRequest( params ).then( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                !!hideResponse && hideResponse();
                addComment( mid, filter );
                this.refreshSubComments();
            } else {
                return Promise.reject( { msgId, message } );
            }
        } ).catch( e => {
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.responsing = false;
        } );
    }

    /**
     * 刷新state中的二级评论数据
    */
    refreshSubComments = () => {
        this.setState( {
            subComments: []
        } );
        this.hideSubComments();
        this.loadSubComments();
    }

    /**
     * 加载按钮点击处理，加载中点击无效
    */
    loadHandler = () => {
        if ( !this.state.showSubComments ) {
            return this.refreshSubComments();
        }
        this.loadSubComments();
    }

    /**
     * 加载/加载更多二级评论，同时自动增加页码
    */
    loadSubComments = () => {
        if ( this.state.isLoading ) {
            return;
        }
        let { page, loadend } = this.state;
        if ( loadend ) {
            return;
        }
        let { mid, cid, showModal } = this.props;
        this.setState( {
            isLoading: true,
            showSubComments: true
        } );
        let { request, cancelRequest } = sendGetSubCommentOfHotCommentRequest( { mid, cid, page } );
        this.cancelGetSubComments = cancelRequest;
        request.then( ( { msgId, message, comments } ) => {
            if ( msgId === '200' ) {
                if( comments.length === 0 ) {
                    return this.setState( {
                        loadend: true
                    } )
                }
                this.checkUsersInComments( comments );
                let newComments = ( this.state.subComments || [] ).slice(0);
                newComments.push( ...comments );
                this.setState( {
                    subComments: newComments,
                    page: ++this.state.page
                } );
            } else {
                showModal( { text: GET_RESPONSE_ERROR  + RETRY_LATER } );
            }
        } ).catch( e => {
            if ( !e.message && e.__CANCEL__ ) {//取消请求不提示失败
                return;
            }
            //show modal here?
        } ).finally( () => {
            this.setState( {
                isLoading: false
            } );
        } )
    }

    /**
     * 隐藏二级评论，同时重置二级评论所有数据
    */
    hideSubComments = () => {
        this.setState( {
            showSubComments: false,
            page: this.firstPage,
            loadend: false
        } )
    }

    /**
     * 获取子评论中所有相关用户的数据
    */
    checkUsersInComments( comments ) {
        let accounts = [];
        comments.forEach( comment => {
            accounts.push( comment.uid );
        } );
        checkUsersData( accounts )
    }

    /**
     * 删除按钮点击回调，弹出确认弹框
    */
    deleteSubCommentHandler = ( cid, uid ) => {
        let { showModal, mid } = this.props,
            userUID = getUserUID();
        if ( uid == userUID ) {
            showModal( { type: MODAL_CONFIRM, text: "确认删除此评论吗？", callback: this.deleteSubComment.bind( this, { cid, uid, mid } ) } )
        }
    }

    /**
     * 删除子评论
    */
    deleteSubComment = ( { cid, uid, mid } ) => {
        if ( this.deletingSubComment ) {
            return;
        }
        this.deletingSubComment = true;
        let { showModal, deleteComment, filter } = this.props;
        sendDeleteCommentRequest( { cid, mid } ).then( ( { msgId, message } ) => {
            if ( msgId === '200' ) {
                deleteComment( mid, filter );
                this.deleteSubCommentInState( cid );
            } else {
                showModal( { text: "删除失败，请稍候再试！" } );
            }
        } ).catch( e => {
            showModal( { text: "请求失败，请稍候再试！" } );
        } ).finally( () => {
            this.deletingSubComment = false;
        } )
    }

    /**
     * 删除子评论后刷新评论
    */
    deleteSubCommentInState = ( cid ) => {
        this.refreshSubComments();
    }

    /**
     * 左侧tip信息逻辑较多，单独列出
    */
    getTipText( { alias } ) {
        let { sum, responses } = this.props;
        let { showSubComments, isLoading, loadend, subComments } = this.state;
        sum = subComments && subComments.length || sum;
        if ( !showSubComments ) {
            return `${alias} 等人共${sum}条回复`
        }
        if ( isLoading ) {
            return '加载中...';
        }
        if ( loadend ) {
            return '没有更多了...';
        }
        return '加载更多';
    }

    /**
     * 一级评论的回复区域，以及二级评论的显示区域
     * sum: {Number} 子评论总数，第一次有用，之后都用state中的subComments数组的length
     * startResponse: {Function} 添加一级组件中对应评论的点赞数量
    */
    render () {
        let { responses, sum, startResponse } = this.props;
        let { subComments, loadend, isLoading, showSubComments } = this.state;
        sum = subComments ? subComments.length : sum;
        let showTip = sum >= 1;
        let alias;
        if ( showTip ) {
            alias = getUserData( getPersonById( subComments && subComments[0].uid || responses[0].uid ) ).alias || 'unnamed';
        }
        let showHideSubComment = sum > 0 && !isLoading && showSubComments;
        return ( <Fragment>
                { sum === 0 && !startResponse ? <div className="comment-main-line"></div> : false }
                { !startResponse ? false : <div className="cia-wrapper clear">
                    <CommentInputArea callback={this.reponseCommentHandler}/>
                </div> }
                <div className={'comment-response-wrapper clear'}>
                    { showSubComments ? ( subComments || [] ).map( ( { cid, uid, comment, comment_time }, i ) => {
                        let { avatar, alias } = getUserData( getPersonById( uid ) );
                        return <div key={i} className={'comment-response-item clear'}>
                            <CommentContent cid={cid} uid={uid} deleteComment={this.deleteSubCommentHandler} name={alias} avatar={avatar} text={comment} time={comment_time} />
                        </div>
                    } ) : false }
                    { !showTip ? false : <div className="comment-tip clear">
                        <div onClick={this.loadHandler} className="comment-tip-text" style={ loadend ? { cursor : 'default' } : undefined } >{ this.getTipText( { alias } ) }</div>
                        { showHideSubComment ? <div className="comment-tip-hide" onClick={this.hideSubComments}>收起</div> : false }
                    </div> }

                </div>
            </Fragment>
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
)( ResponseArea );
