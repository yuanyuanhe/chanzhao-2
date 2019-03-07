import React, { Component, Fragment } from 'react';
import "./index.css";
import {transTime2} from "../../../../../util";
import Avatar from '../../../../generics/Avatar';
import {getUserUID} from "../../../../../redux/store/storeBridge";
class CommentContent extends Component{
    constructor( props ) {
        super( props );
    }

    clickHandler = () => {
        let { cid, deleteComment, uid } = this.props;
        !!deleteComment && deleteComment( cid, uid );
    }

    /**
     * 一级评论组件
    */
    render () {
        let { children, avatar, name, text, time, uid } = this.props;
        let userUID = getUserUID();
        return (
            <Fragment>
                <Avatar classes={['comment-avatar']} src={avatar}/>
                <div className="comment-main clear">
                    <div className="clear bw" onClick={this.clickHandler} style={ uid == userUID ? { cursor: 'pointer' } : undefined } >
                        <span className="comment-main-alias">{name}：</span><span className="comment-main-text">{ text }</span>
                    </div>
                    <div className="comment-time">
                        { transTime2( time ) }
                    </div>
                    { children }
                </div>
            </Fragment>
        )
    }
}

export default CommentContent;
