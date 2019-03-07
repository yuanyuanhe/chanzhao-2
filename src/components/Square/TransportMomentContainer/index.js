import React, { Component } from 'react';
import "./index.css";
import ModalContainer from '../../generics/ModalContainer';
import Avatar from '../../generics/Avatar';
import { ICON_SHARE_CANCEL } from '../../../configs/iconNames';
import {sendTransportMomentRequest} from "../../../requests";
import MultiLineEllipsis from "../../generics/MultiLineEllipsis";
import {MSGIDS} from "../../../configs/consts";
import {REQUEST_ERROR, RETRY_LATER, TRANSFER_ERROR} from "../../../configs/TIP_TEXTS";
class TransportMomentContainer extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            value: ""
        }
    }

    /**
     * 确定按钮点击处理
    */
    submit = () => {
        let {  showModal, params: { mid, callback }, hideTransportArea } = this.props;
        let { value } = this.state;
        let res_json = JSON.stringify( { mid } );
        sendTransportMomentRequest( { mid, words: value } ).then( ( { msgId } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                !!hideTransportArea && hideTransportArea();
                !!callback && callback();
            } else {
                !!hideTransportArea && hideTransportArea();
                showModal( { text: TRANSFER_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            !!hideTransportArea && hideTransportArea();
            showModal( { text: REQUEST_ERROR } );
        } )
    }

    /**
     * value change handler
    */
    changeHandler = ( e ) => {
        this.setState( {
            value: e.target.value
        } );
    }

    /**
     * 重置转发评论文字
    */
    resetValue() {
        this.setState( {
            value: ""
        } );
    }

    /**
     * 转发秘圈组件
     * params: {Object} 转发秘圈的参数
     *     {
     *         mid: {String} moment id,
     *         src: {String} 如果要转发的秘圈中包含图片的话，就是图片的链接， 相对路径
     *         text: {String} 转发秘圈的文字部分
     *     }
     * hideTransportArea： {Function} 隐藏转发模态框
    */
    render () {
        let { params: { mid, src, text }, hideTransportArea } = this.props;
        let { value } = this.state;
        let textClasses= ['tmp-text-container','bw'];
        !src && textClasses.push( 'with-no-img' );
        let textColor = '#666';
        let bgColor = '#f5f5f5';
        return (
            <ModalContainer zIndex={9999}>
                <div className="transport-main shadow">
                    <div className="transport-header">
                        转发
                        <img className={'tranport-close'} onClick={hideTransportArea} src={ICON_SHARE_CANCEL.convertIconSrc()} alt="" title="" />
                    </div>
                    <div className="transport-moment-profile">
                        {!!src ? <Avatar classes={['tmp-img-container']} src={src.convertSrcWebp()}/> : false }
                        <MultiLineEllipsis bgColor={bgColor} textColor={textColor} text={text} classes={textClasses}/>
                    </div>
                    <textarea placeholder={'说点什么吧...'} onChange={this.changeHandler} value={ value } name="" id="" cols="30" rows="10" className="tmp-input"></textarea>
                    <button className={'transport-submit'} onClick={this.submit}>转发</button>
                </div>
            </ModalContainer>
        )
    }
}

export default TransportMomentContainer;
