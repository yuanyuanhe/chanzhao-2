import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getHistoryMsgs, getMtsdk, getUserUID} from "../../../../../../redux/store/storeBridge";
import ScrollContainer from "../../../../../generics/ScrollContainer";
import {addHistoryMsgsByReverse} from "../../../../../../redux/actions";
import MsgItem from '../../MsgItem';

const CAN = '加载更多...';
const CANNT = '没有更多消息了！';
class MsgArea extends Component{
    constructor( props ) {
        super( props );
        this.pageLen = 20;
        this.state = {
            msgAllLoaded: false,
            msgs: [],
            loadMoreText: CAN,
            endTime: Date.now()
        }
        this.isLoading = false;
    }

    /**
     * 获取第一页历史记录
    */
    getInitHistory( sid ) {
        //won't refresh unless refresh page
        let historys = getHistoryMsgs( sid );
        if ( historys.length > 0 ) {
            this.setState( {
                msgs: historys.slice( -this.pageLen )
            } );
            return;
        }
        let mtsdk = getMtsdk();
        this.isLoading = true;
        mtsdk.getHistoryMsgs( { sid } ).then( ( { msgs } ) => {
            return this.loadedHandler( msgs, sid );
        } );
        return [];
    }

    /**
     * 历史记录加载完后添加到state
    */
    loadedHandler( msgDatas, sid ) {
        let { loadMoreText, msgs } = this.state;
        let msgCache = msgs.slice(0);
        if ( msgDatas.length === 0 ) {
            loadMoreText !== CANNT && this.setState( {
                loadMoreText: CANNT
            } );
            this.isLoading = false;
            return;
        } else {
            // msgDatas.forEach( v => {
            //     msgCache.unshift( v )
            // } );
        }
        this.props.reverseAddHistoryMsgs( msgDatas );
        this.setState( {
            msgs: getHistoryMsgs( sid )
        } );
        this.isLoading = false;
    }

    /**
     * 获取更多聊天记录
    */
    getMoreHistory( sid ) {
        if ( this.isLoading ) {
            return;
        }
        this.isLoading = true;
        let { msgs, loadMoreText } = this.state;
        if ( msgs.length === 0 ) {
             loadMoreText !== CANNT && this.setState( {
                 loadMoreText: CANNT
             } );
             this.isLoading = false;
             return;
        } else {

        }
        let historys = getHistoryMsgs( sid ),
            mLen = msgs.length,
            hLen = historys.length;
        if ( hLen > mLen ) {
            this.setState( {
                msgs: historys.slice( -( this.pageLen + mLen ) )
            } );
            this.isLoading = false;
            return;
        }
        let endTime = msgs[0].time,
            mtsdk = getMtsdk();
        mtsdk.getHistoryMsgs( { sid, endTime } ).then( ( { msgs } ) => {
            return this.loadedHandler( msgs, sid );
        } );
    }

    /**
     * 切换sid时重新获取msgs
    */
    componentWillReceiveProps( nextProps, nextState ) {
        let { msgs } = this.state,
            { show, sid } = nextProps,
            { show: curShow, sid: curSid } = this.props;
        if ( !show ) {
            msgs.length !== 0 && this.setState( {
                msgs: [],
                loadMoreText: CAN
            } );
            return;
        }
        if ( msgs.length === 0 && !this.isLoading ) {
            this.getInitHistory( sid )
            return false;
        } else {

        }
        if ( sid !== curSid ) {
            msgs.length !== 0 && this.setState( {
                msgs: [],
                loadMoreText: CAN
            } );
            return this.getInitHistory( sid );
        }
    }

    /**
     * 聊天记录消息展示区域
     * sid: {String} session id
     * show: {Boolean} 聊天记录显示开关
    */
    render () {
        let { sid, show } = this.props;
        let { msgs,loadMoreText } = this.state;
        if ( !show ) {
            return false;
        }
        return (
            <ScrollContainer>
                <div className="load-more" id="load-more" onClick={this.getMoreHistory.bind( this, sid )}>{loadMoreText}</div>
                { msgs.map( ( v, i ) => {
                    return <MsgItem msgs={msgs} i={i} key={i} msg={v} />
                } ) }
            </ScrollContainer>
        )
    }
}

function mapStateToProps( state ) {
    return {
        historyMsg: state.historyMsg
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        reverseAddHistoryMsgs: ( msgs ) => dispatch( addHistoryMsgsByReverse( msgs ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( MsgArea ) );
