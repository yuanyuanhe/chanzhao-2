import React, {Component} from 'react';
import "./index.css";
import {SENDER_ME, SENDER_YOU} from "../../../../../../configs/consts";
import $ from 'jquery';
const audioClass = "msg-item audio-msg ";
const audioPlayClassPrefix = 'play-';
class AudioMsg extends Component {
    constructor(props) {
        super(props);
    }

    getMsgNode = ( node ) => {
        this.$msgNode = node;
    }

    /**
     * 播放音频，播放一个音频的时候停止播放其他的音频
    */
    playAudio = ( e ) => {
        if (!!window.Audio) {
            var $node = $(e.target),
                cClass = $node.prop('class'),
                btn;
            !/j-mbox/gi.test( cClass ) && ( $node = $node.parent() );
            btn = $node.children(".j-play");
            $.each( $('.u-audio.play'), ( i, v ) => {
                let $item = $( v );
                let intervalId = $item.data( "intervalId" );
                intervalId && clearInterval( intervalId );
                $item.data( "intervalId", "" ).removeClass("play").parent()[0].className = audioClass;
            } );
            $node.addClass( "play" );
            let num = 0;
            let playId = setInterval( () => {
                if ( !this.$msgNode ) {
                    return;
                }
                this.$msgNode.className = audioClass + audioPlayClassPrefix + ( num++ % 3 );
            }, 300 );
            $node.data( "intervalId", playId );
            setTimeout( () => {
                $node.removeClass("play");
                clearInterval( playId );
                this.$msgNode && ( this.$msgNode.className = audioClass );
            }, parseInt(btn.data("dur")) * 1000);

            new window.Audio(btn.attr("data-src")).play().catch( e=> {
                alert( "音频播放失败！" );
            } )
        } else {
            alert("您的浏览器不支持音频播放，为了更好地体验秘图网页版，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。");
        }
    }

    /**
     * 音频消息
    */
    render() {
        let {src, duration,sender,message} = this.props;
        let str,
            main,
            className;
        duration = Math.floor(duration / 1000);//second
        if (!!window.Audio) {
            if ( sender === SENDER_ME ) {
                className = ' right';
            } else {
                className = ' left';
            }
            main = <div className={"u-audio j-mbox" + className} onClick={this.playAudio}>
                <a href="javascript:;" className="j-play playAudio" data-dur={duration}  data-src={src}></a>
                <b className="j-duration">{duration}"</b>
                <span className="u-icn u-icn-play" title="播放音频"></span>
            </div>
        } else {
            main = <a href={src} target="_blank" className="download-file">
                <span className="icon icon-file2"></span>
                [{ sender===SENDER_ME ? "发送" : "收到" }一条语音消息]
            </a>;
        }
        return (
            <div className={ audioClass } ref={this.getMsgNode}>
                {main}
            </div>
        )
    }
}

export default AudioMsg;
