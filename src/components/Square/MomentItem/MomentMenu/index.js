import React, { Component } from 'react';
import "./index.css";
import { ICON_MORE } from '../../../../configs/iconNames';
import autoBind from 'react-autobind';
import {sendAddCollectionRequest, sendDeleteCollectionRequest, sendDeleteSquareMomentRequest, sendFeedBackRequest, sendHideMomentRequest} from "../../../../requests";
import {connect} from "react-redux";
import {collectMomentInMomentProvider, cancelCollectMomentInMomentProvider, deleteMomentInMomentProvider, hideMomentInMomentProvider} from "../../../../redux/actions";
import {getPersonById} from "../../../../redux/store/storeBridge";
import {getUserData} from "../../../../util";
import {MSGIDS, REPORT_TYPE_MOMENT} from "../../../../configs/consts";
import ChatMenuHeader from '../../../generics/ChatMenuHeader';
import {MomentFilters} from "../../MomentProvider";
import {CANCEL_COLLECT_MOMENT_ERROR, COLLECT_MOMENT_ERROR, DELETE_MOMENT_ERROR, HIDE_MOMENT_ERROR, MOMENT_COLLECTED, REPORT_ERROR, REPORT_SUCCESS, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";
class MomentMenu extends Component{
    constructor( props ) {
        super( props );
        autoBind( this, 'collectHandler', 'hideMomentHandler', 'reportHandler' );
        this.menuData = [
            {
                text: "收藏",
                clickHandler: this.collectHandler
            },{
                text: "隐藏此条状态",
                clickHandler: this.hideMomentHandler
            },{
                text: "举报此条状态",
                clickHandler: this.reportHandler
            }
        ];
        this.state = {
            show: false
        }
    }

    /**
     * 收藏按钮点击回调，收藏/取消收藏后改变rudux中相关说说的收藏状态，不需要重新获取秘圈数据并刷新
     * mid： {String} 此秘圈mid
     * showModal: {Function} 通用弹框弹出方法
     * collected: {Boolean} 是否已被收藏
     * collectMoment, cancelCollectMoment: {Function} 改变redux中改秘圈（转发说说则是所有转发原说说和原说说的秘圈）的收藏状态
     * filter: {String} moment provider 类型
     * transportedMid: {String} 被转发的原说说的mid
     * isTransport: {Boolean} 此说说是否是转发类型的说说
    */
    collectHandler() {
        let { mid, showModal, collected, collectMoment, cancelCollectMoment, filter, transportedMid, isTransport } = this.props;
        if ( !collected ) {
            sendAddCollectionRequest( transportedMid || mid ).then( ( { msgId } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    collectMoment( transportedMid || mid, filter, isTransport );
                    this.hideMenu();
                } else if ( msgId === MSGIDS.DATA_EXISTED ) {
                    showModal( { text: MOMENT_COLLECTED } );
                } else {
                    showModal( { text: COLLECT_MOMENT_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e )
                showModal( { text: REQUEST_ERROR } )
            } );
        } else {
            sendDeleteCollectionRequest( transportedMid || mid ).then( ( { msgId } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    cancelCollectMoment( transportedMid || mid, filter, isTransport );
                    this.hideMenu();
                } else {
                    showModal( { text: CANCEL_COLLECT_MOMENT_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                console.log( e )
                showModal( { text: REQUEST_ERROR } );
            } );
        }
    }

    /**
     * 隐藏此秘圈，此后此用户刷新秘圈不再显示该说说
     * hideMoment: {Function} 在redux中删除此秘圈
    */
    hideMomentHandler() {
        let { mid, showModal, hideMoment, filter } = this.props;
        sendHideMomentRequest( mid ).then( ( { msgId } ) => {
            if ( msgId === '200' ) {
                hideMoment( mid, filter );
                //直接没了 不用hide
            } else {
                showModal( { text: HIDE_MOMENT_ERROR + RETRY_LATER } );
            }
        } ).catch( e =>  {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } );
    }

    /**
     * 举报按钮点击回调，显示举报弹框
     * showReport: {Function} 显示举报秘圈弹框
    */
    reportHandler() {
        this.hideMenu();
        let { showReport, mid, filter, account } = this.props;
        let { alias } = getUserData( getPersonById( account ) );
        !!showReport && showReport( { text: `举报${alias}的秘圈`, callback: this.reportMoment } )
    }

    /**
     * 发送举报秘圈请求并处理
     * this.reporting: 防止连点多次发送
    */
    reportMoment = ( reportId, reportText ) => {
        if ( this.reporting ) {
            return;
        }
        this.reporting = true;
        let { mid, showModal } = this.props,
            content = JSON.stringify( { mid, type: reportId, content: reportText } );
        sendFeedBackRequest( REPORT_TYPE_MOMENT, content ).then( ( ( { msgId, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: REPORT_SUCCESS } );
            } else {
                console.log( msgId, message );
                showModal( { text: REPORT_ERROR + RETRY_LATER } )
            }
        } ) ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            this.reporting = false;
        } )
    }

    /**
     * 根据收藏状态，秘圈发布者帐号确定菜单内容，自己发的秘圈可以删除
    */
    getMenuData() {
        let { collected, account, userUID, filter } = this.props;

        let menuData = this.menuData.slice( 0 );
        if ( collected ) {
            menuData[ 0 ].text = '取消收藏';
        } else {
            menuData[ 0 ].text = '收藏';
        }
        if ( filter === MomentFilters.collection ) {
            menuData.splice( 1, 1 );
        } else if ( filter === MomentFilters.user ) {
            if ( account == userUID ) {
                menuData.splice( 1, 2 );
            } else {
                menuData.splice( 1, 1 );
            }
        }
        if ( account == userUID ) {
            menuData.push({
                text: "删除",
                clickHandler: this.deleteMoment
            } )
        }
        return menuData;
    }

    /**
     * 删除自己（！）发的秘圈
     * deleteMoment: {Function} 在redux中删除此秘圈，不需要重新获取数据并刷新
    */
    deleteMoment = () => {
        let { mid, showModal, filter, deleteMoment } = this.props;
        sendDeleteSquareMomentRequest( mid ).then( ( { msgId, message } ) => {
            if ( msgId === '200' ) {
                deleteMoment( mid, filter );
            } else {
                console.log( msgId, message );
                showModal( { text: DELETE_MOMENT_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } )
    }

    /**
     * 控制菜单的显隐
    */
    iconClickHandler = ( e ) => {
        this.setState( {
            show: !this.state.show
        } )
    }

    /**
     * 显示菜单
    */
    showMenu = () => {
        this.setState( {
            show: true
        } )
    }

    /**
     * 隐藏菜单
    */
    hideMenu = () =>{
        this.setState( {
            show: false
        } )
    }

    /**
     * 秘圈菜单组件
     * collected: {Boolean} 秘圈是否已被收藏
     * filter: {String} moment provider 类型
     * account: {String|Int} 秘圈发布者帐号
     * mid: {String} 秘圈id
    */
    render () {
        let { collected, filter, account, mid } = this.props;
        let { show } = this.state;
        let menuData = this.getMenuData();
        return (
            <div className={'moment-menu-container clear'} onMouseLeave={this.hideMenu}>
                <div className="moment-menu-icon-wrapper" onMouseEnter={this.showMenu}>
                    <img className={'moment-menu-icon'} src={ICON_MORE.convertIconSrc()} alt="菜单" title="菜单" />
                </div>
                <div className={ "moment-menu-wrapper" + ( show ? ' show' : "" ) }>
                    <ChatMenuHeader width={140}/>
                    <div className="moment-menu-list shadow">
                        { menuData.map( ( { text, clickHandler }, i ) => {
                            return <div onClick={clickHandler} className="moment-menu-item" key={i}>{text}</div>
                        } ) }
                    </div>

                </div>
            </div>
        )
    }
}
function mapStateToProps( state ) {
    return {
        userUID: state.userUID
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        hideMoment: ( mid, momentType ) => dispatch( hideMomentInMomentProvider( mid, momentType ) ),
        collectMoment: ( mid, momentType, isTransport ) => dispatch( collectMomentInMomentProvider( mid, momentType, isTransport ) ),
        cancelCollectMoment: ( mid, momentType, isTransport ) => dispatch( cancelCollectMomentInMomentProvider(  mid, momentType, isTransport ) ),
        deleteMoment: ( mid, momentType ) => dispatch( deleteMomentInMomentProvider( mid, momentType ) )
    }
}
export default connect(
    mapStateToProps,
    mapDispathToProsp
) ( MomentMenu );
