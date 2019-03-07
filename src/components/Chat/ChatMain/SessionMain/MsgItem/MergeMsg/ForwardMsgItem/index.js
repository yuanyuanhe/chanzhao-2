import React, { Component } from 'react';
import "./index.css";
import Avatar from '../../../../../../generics/Avatar'
import {transTime2} from "../../../../../../../util";
import {FORWARD_MSG_TYPE} from "../../../../../../../configs/consts";
import FileMsg from "../../FileMsg";
import AudioMsg from "../../AudioMsg";
import VideoMsg from "../../VideoMsg";
import TextMsg from "../../TextMsg";
import ImageMsg from "../../ImageMsg";
import NotSupportMsg from "../../NotSupportMsg";

class ForwardMsgItem extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 获取消息主体部分
    */
    getMsgMain() {
        let { data: { type, url:src, text = "", duration=0,fileLength,fileName } } = this.props;
        switch ( parseInt( type ) ) {
            case FORWARD_MSG_TYPE.TEXT:
                return <TextMsg text={text}/>;
            case FORWARD_MSG_TYPE.FILE:
                return <FileMsg src={src} file={ { name: fileName, size: fileLength } }/>;
            case FORWARD_MSG_TYPE.AUDIO:
                return <AudioMsg src={src} duration={duration} sender={'you'}/>;
            case FORWARD_MSG_TYPE.VIDEO:
                return <VideoMsg src={src} />
            case FORWARD_MSG_TYPE.IMAGE:
                return <ImageMsg src={src}/>
            default:
                return <NotSupportMsg type={'web端暂不支持的'}/>
        }
    }

    /**
     * 被转发的消息item组件 纯消息部分基本复用其他的MsgItem 用户数据部分（头像、昵称）和会话中的消息差别较大
     * data: {Object} 消息数据
     *     {
     *         name: {String} 昵称
     *         avatarUrl: {String} 头像url 相对路径
     *         timestamp: {Number} 发消息的时间戳（ios可能会传10位秒级时间戳）
     *         text: {String} 转发消息文字
     *         type: {Number} 转发消息类型
     *     }
    */
    render () {
        let { data: { name, avatarUrl, timestamp, text, type } } = this.props;
        return (
            <div className={'forward-msg-item clear'}>
                <Avatar classes={['forward-msg-avatar']} src={avatarUrl.checkSrcHost()}/>
                <div className="forward-msg-content clear">
                    <div className="forward-msg-data">
                        <div className="forwrad-msg-name auto-omit">{name}</div>
                        <div className="forwrad-msg-time">{ transTime2( timestamp.length === 13 ?parseInt( timestamp ) : timestamp * 1000 ) }</div>
                    </div>
                    <div className="forward-msg-main">
                        { this.getMsgMain() }
                    </div>
                </div>
            </div>
        )
    }
}

export default ForwardMsgItem;
