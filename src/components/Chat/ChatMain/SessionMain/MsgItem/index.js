import React, { Component,Fragment } from 'react';
import "./index.css";
import Avatar from '../../../../generics/Avatar';
import {checkJSON, getMemberNick, getMessage, getNick, getUserData, transNotification, transTime} from "../../../../../util";
import NoticeMsg from './NoticeMsg';
import NotSupportMsg from './NotSupportMsg';
import MergeMsg from './MergeMsg';
import TextMsg from './TextMsg';
import AudioMsg from './AudioMsg';
import VideoMsg from './VideoMsg';
import FileMsg from './FileMsg';
import DIYEmojiMsg from './DIYEmojiMsg';
import ImageMsg from './ImageMsg';
import {getPersonById, getUserUID} from "../../../../../redux/store/storeBridge";
import {GEO, TIP, TYPES, CUSTOM, RED_ENVELOPE, MERGE_MSG, TRANSFER, MOMENT, GAME_SHARE, TEXT, VIDEO, AUDIO, IMAGE, FILE, CHARTLET, CARD, VIDEO_GIF, SENDER_ME, SENDER_YOU} from '../../../../../configs/consts';
import {connect} from "react-redux";
import TimeTag from "./TimeTag";
import VideoGif from "./VideoGif";

class MsgItem extends Component{
    constructor( props ) {
        super( props );
    }

    parseMsg( message ) {
        // let msgHtml;
        
        return {
            type: message.type
        }
    }

    /**
     * 用户信息部分（头像、昵称）组件
    */
    getUserPart ( message, msgs, i ) {
        let userUID = getUserUID(),
            user = getUserData( getPersonById( message.from ) )
        let from = message.from,
            avatar = user.avatar,
            showNick = message.scene === 'team' && from !== userUID,
            nickInTeam;
        if ( showNick ) {
            nickInTeam = getMemberNick( message.target, from )  || getNick( from );
        }
        //time tag
        let timeTag = false;
        if (i == 0) {
            timeTag = <TimeTag time={transTime(message.time)}/>;
        } else {
            if (message.time - msgs[i - 1].time > 5 * 60 * 1000) {
                timeTag = <TimeTag time={transTime(message.time)}/>;
            }
        }
        return (
            <Fragment>
                {timeTag}
                <div className={"msg-user"}>
                    <Avatar src={avatar} title={nickInTeam} alt={nickInTeam} classes={['msg-user-avatar']}/>
                    { !showNick ? false : <span className={'msg-user-name'}>{ nickInTeam }</span> }
                </div>
            </Fragment>
        )
    }

    /**
     * 整个单个消息的全部部分
    */
    getContainer( msg, msgs, i ) {
        let userUID = getUserUID(),
            sender = '';
        if ( msg.from === msg.to ) {
            if ( msg.fromClientType === "Web" ) {
                sender = SENDER_ME;
            } else {
                sender = SENDER_YOU;
            }
        } else {
            if ( msg.from == userUID && !msg.fromClientType) {
                sender = SENDER_ME;
            } else {
                sender = SENDER_YOU;
            }
            if ( msg.from == userUID && msg.to != userUID ) {
                sender = SENDER_ME;
            }
        }
        let { attach } = msg;
        if ( attach && attach.type && ( attach.netcallType === undefined ||
                ( attach.type !== "netcallBill" && attach.type !== "netcallMiss" ) ) || msg.type === TIP ) {
            //通知类消息
            if ( attach && attach.netcallType !== undefined ) {
                return false;// 隐藏掉netcall相关的系统通知消息
            }
            return <NoticeMsg text={ !!attach ? transNotification( msg ) : msg.tip}/>
        }
        return (
            <div className={"msg-container clear msg-" + sender}>
                { this.getUserPart( msg, msgs, i ) }
                { this.getMain( msg, sender ) }
            </div>
            )
    }

    /**
     *  获取单纯的消息部分（不包括头像昵称等）
    */
    getMain( message, sender ) {
        //msg
        let main = false;
        let url = message.file ? message.file.url : '',
            userUID = getUserUID(),
            user = getUserData( getPersonById( message.from ) );
        let { scrollToBottom } = this.props;
        //聊天消息
        let type = message.type;
        if ( type === TEXT ) {
            main = <TextMsg text={message.text} />
        }
        if ( type === VIDEO ) {
            main = <VideoMsg src={ url }/>;
        }
        if ( type === AUDIO ) {
            main = <AudioMsg sender={sender} msg={message} src={ url } duration={  message.file.dur }/>
        }
        if ( type === IMAGE ) {
            main = <ImageMsg loadHandler={scrollToBottom} src={ url + '?imageView&thumbnail=200x0&quality=85'} />
        }
        if ( type === FILE ) {
            let { file: { ext, name } } = message;
            main = <FileMsg file={message.file} src={url} ext={ext} name={name}/>
        }
        if ( type === GEO ) {
            main = <NotSupportMsg type={ TYPES[ GEO ] }/>
        }
        if ( type === TIP ) {
            main = <NoticeMsg text={message.tip}/>
        }
        if ( type === CUSTOM ) {
            let content = checkJSON( message.content );
            switch ( +content.type ) {
                case CARD:
                    main = <NotSupportMsg type={ TYPES[ CARD ] } />;
                    break;
                case VIDEO_GIF:
                    main = <VideoGif loadHandler={scrollToBottom} data={ content.data }/>;
                    break;
                case RED_ENVELOPE:
                    main = <NotSupportMsg type={ TYPES[ RED_ENVELOPE ] } />;
                    break;
                case MERGE_MSG:
                    main = <MergeMsg data={ content.data }/>;
                    break;
                case TRANSFER:
                    main = <NotSupportMsg type={ TYPES[ TRANSFER ] } />;
                    break;
                case MOMENT:
                    main = <NotSupportMsg type={ TYPES[ MOMENT ] } />;
                    break;
                case GAME_SHARE:
                    main = <NotSupportMsg type={ TYPES[ GAME_SHARE ] } />;
                    break;
                case CHARTLET:
                    let { url, catalog, chartlet } = content.data;
                    main = <DIYEmojiMsg loadHandler={scrollToBottom} chartlet={ chartlet } catalog={ catalog } src={ url }/>
                    break;
                default:
                    main = false;
                    break;
            }
        }

        return (
           main
        )
    }

    componentDidMount(){
        let { scrollToBottom } = this.props;
        scrollToBottom && scrollToBottom();
    }

    /**
     * 消息组件
     * msgs: {Array} 所有消息，用于确定timeTag
     * msg: {Object} 当前需要渲染的消息
     * i: {Int} msg index
    */
    render () {
        let { msg, msgs, i } = this.props,
            data = this.parseMsg( msg ),
            main = this.getContainer( msg, msgs, i );
        return (
            <div className={"msg-item-container clear" + ( " msg-" + data.type )}>
                { main }
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispathToProsp
)( MsgItem );

