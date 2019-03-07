import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import InputMenu from './InputMenu';
import {P2P, TEAM,PINUP} from "../../../../../configs/consts";
import {getMtsdk, getPersonById, getUserUID, isFriend} from "../../../../../redux/store/storeBridge";
import {getUserData, _$escape, resetForm, getSceneAndAccountBySID} from "../../../../../util";
import {store} from "../../../../../redux/store";
import {addMsg} from "../../../../../redux/actions";
import {getImagePath} from "../../../../../util/emoji";
import {BROWSER_VERSION_TIP, DROP_TIP, SAFARI_TIP, TIP_MSG, UPLOAD_ERROR, UPLOAD_SUCCESS} from "../../../../../configs/TIP_TEXTS";

const lenLimit = 500;

class InputArea extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            text: ""
        }
        this.textAreaId = 'session-main-textarea';
        this.textChange = this.textChange.bind( this );
        this.keyDownHandler = this.keyDownHandler.bind( this );
        this.selectedEmoji = this.selectedEmoji.bind( this );
        this.fileHandler = this.fileHandler.bind( this );
        this.uploadprogress = this.uploadprogress.bind( this );
        this.uploaddone = this.uploaddone.bind( this );
        this.pasteUploadFile = this.pasteUploadFile.bind( this );
        this.dropUploadFile = this.dropUploadFile.bind( this );
    }

    /**
     * 上传文件消息
    */
    fileHandler( file, shouleReset ) {
        let mtsdk = getMtsdk(),
            { sid, addMsg, fileId } = this.props;
        if ( !this.filterSessionId( sid ) || !file ) {
            shouleReset && resetForm( fileId );
            return;
        }
        file.value = Date.now() + file.name;
        mtsdk.sendFileMsg( { sid, file, uploadprogress: this.uploadprogress, uploaddone: this.uploaddone } ).then( ( msg ) => {
            shouleReset && resetForm( fileId );
            addMsg( msg );
        } );
    }

    /**
     * 上传进度
    */
    uploadprogress( data ) {
        console.log( data.percentageText, data );
    }

    /**
     * 上传完毕后提示
    */
    uploaddone( error, file ) {
        this.props.showModal( { text: ( !error ? UPLOAD_SUCCESS : UPLOAD_ERROR ) } );
    }

    /**
     * 选择表情
    */
    selectedEmoji( result ) {
        if ( result.type === PINUP ) {
            let index = Number( result.emoji ) + 1,
                catalog = result.category,
                chartlet = result.category + '0' + ( index >= 10 ? index : '0' + index );
            let catalog2 = _$escape( catalog ),
                chartvar = _$escape( chartlet );
            let url = getImagePath() + catalog2 + '/' + chartvar + '.png';
        } else {
            this.changeText( this.props.words[ this.props.sid ] || "" + result.emoji );
        }
    }

    /**
     * 发送前过滤非法sessionId
    */
    filterSessionId( sid ) {
        let userUID = getUserUID();
        let { scene, account: to } = getSceneAndAccountBySID( sid );
        if ( scene === TEAM ) {

        } else if ( scene === P2P ) {
            if ( !isFriend( to ) && to != userUID ) {
                return false;
            }
        } else {

        }
        return true;
    }

    /**
     * 利用IMSDK发送文本
    */
    sendTextMsg() {
        let userUID = getUserUID(),
            { name } = getUserData( getPersonById( userUID ) ),
            { words: text, sid } = this.props,
            [ scene, to ] = sid.split( '-' );
        text = text[ sid ] || "";
        if ( text.length === 0 ) {
            return;
        } else if ( text.length > lenLimit ) {
            //show tip
            return;
        } else {
            if ( !this.filterSessionId( sid ) ) {
                return;
            } else if ( scene === P2P ) {

            }
        }
        //above is illegal
        let custom = JSON.stringify( {
            pushContent: `${ name }:${ text }`
        } );
        let mtsdk = getMtsdk();
        // mtsdk.sendTextMessage( {
        mtsdk.sendTextMsg( {
            scene,
            to,
            text,
            custom
        } ).then( res => {
            this.sendMsgDone( res );
        } ).catch( e => {
            console.log( e );
        } );
    }

    /**
     * 消息发送完毕后，将消息添加到redux中，同时清空textarea文本
    */
    sendMsgDone( { msg } ) {
        this.props.addMsg( msg );
        this.changeText( "" );
    }

    /**
     * ctrl+enter 换行
     * enter 发送文本
    */
    keyDownHandler( evt ) {
        if ( evt.keyCode === 13 && evt.ctrlKey ) {
            this.changeText( this.props.words[this.props.sid] + '\n' );
        } else if( evt.keyCode === 13 ){
            this.sendTextMsg();
        } else {

        }
    }

    /**
     * 根据sessionId保存文本
    */
    changeText( text ) {
        this.props.inputChange( this.props.sid, text );
    }

    /**
     * textarea changeHandler
    */
    textChange( e ) {
        this.changeText( e.target.value )
    }

    /**
     * 粘贴上传
    */
    pasteUploadFile( e ) {
        if ( !!document.activeElement && ( document.activeElement.id !== this.textAreaId ) ) {
            //输入面板未获得焦点
            return;
        }
        if ( !document.activeElement ) {
            showModal( { text: TIP_MSG } );
        }
        let { showModal, sid } = this.props;
        if ( !this.filterSessionId( sid ) ) {
                return;
        }
        let cbd = e.clipboardData;
        let ua = window.navigator.userAgent;

        // 如果是 Safari 直接 return
        if ( !(e.clipboardData && e.clipboardData.items) ) {
            showModal( { text: SAFARI_TIP } )
            return;
        }

        // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
        if ( cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
            cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
            ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49 ) {
            showModal( { text: BROWSER_VERSION_TIP } );
            return;
        }

        for( let i = 0; i < cbd.items.length; i++ ) {
            let item = cbd.items[ i ];
            if ( item.kind == "file" ) {
                var blob = item.getAsFile();
                // blob.value = Date.now() + blob.name;
                this.fileHandler( blob, false );
                // blob 就是从剪切板获得的文件 可以进行上传或其他操作
            }
        }
    }

    /**
     * 文件拖拽上传
    */
    dropUploadFile( e ) {
        e.preventDefault(); //取消默认浏览器拖拽效果
        let { showModal, sid } = this.props;

        if ( !this.filterSessionId( sid ) ) {
            return;
        }
        if ( !e.dataTransfer ) {
            showModal( { text: DROP_TIP } );
            return false;
        }
        let fileList = e.dataTransfer.files; //获取文件对象
        //检测是否是拖拽文件到页面的操作
        if ( fileList.length == 0 ) {
            return false;
        }
        fileList[0].value = Date.now() + fileList[0].name;
        this.fileHandler( fileList[0], false );
    }

    /**
     * 聊天输入部分
    */
    render () {
        let { sid, words } = this.props,
            { text } = this.state;
        return (
            <div className={"session-main-input-area"}>
                <InputMenu selectedEmoji={this.selectedEmoji} fileId={this.props.fileId} fileHandler={this.fileHandler}/>
                <textarea onDrop={this.dropUploadFile} onPaste={this.pasteUploadFile} onKeyDown={ this.keyDownHandler } className={'session-main-input-textarea'} value={ words[sid] || "" } onChange={this.textChange} name="" id={this.textAreaId} cols="30" rows="10">
                </textarea>
                <div className="input-area-tip">按下Enter发送内容/Ctrl+Enter或Command+Enter换行</div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        teamMap: state.teamMap,
        teamMembers: state.teamMembers,
        friends: state.friendlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        addMsg: ( msg ) => dispatch( addMsg( msg ) )
    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( InputArea ) );
