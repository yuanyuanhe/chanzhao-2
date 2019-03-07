import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {sendGetLocationRequest, sendGetSafeStateRequest, sendRaiseAlarmRequest, sendSendMessageRequest} from "../../requests";
import Map from '../generics/Map';
import SubTitle from '../generics/SubTitle';
import { ICON_ALARM, ICON_EMERGENCY, ICON_REFRESH } from '../../configs/iconNames';
import {ALARM_ERROR, ALARM_SUCCESS, FIND_BACK_NOT_TURNED_ON, GET_LOCATION_ERROR, ICON_TEXT_ALARM, ICON_TEXT_REFRESH_LOCATION, ICON_TEXT_SEND_MESSAGE, REQUEST_ERROR, RETRY_LATER, SEND_MESSAGE_ERROR, SEND_MESSAGE_EXCEEDED_LIMIT, SEND_MESSAGE_SUCCESS, UNPAID} from "../../configs/TIP_TEXTS";
import {MSGIDS} from "../../configs/consts";

class FindBack extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            location: [],
            mapId: 'findback-map',
            focusRefresh: false
        }
    }

    get subTitleData() {
        return [
            { iconSrc: ICON_REFRESH, text: ICON_TEXT_REFRESH_LOCATION, clickHandler: this.refreshLocation, classes: ['findback-menu-item'] },
            { iconSrc: ICON_ALARM, text: ICON_TEXT_ALARM, clickHandler: this.triggerAlarm, classes: ['findback-menu-item'] },
            { iconSrc: ICON_EMERGENCY, text: ICON_TEXT_SEND_MESSAGE, clickHandler: this.sendMessage, classes: ['findback-menu-item'] }
        ]
    }

    componentWillMount() {
        this.refreshLocation();
        // sendGetSafeStateRequest()
    }

    /**
     * 刷新位置
    */
    refreshLocation = () => {
        let { showModal } = this.props;
        sendGetLocationRequest().then( ( { msgId, message, location } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    location,
                    focusRefresh: true
                } );
            } else {
                console.log( message );
                let text = GET_LOCATION_ERROR;
                if ( msgId === MSGIDS.ACCESS_ERROR ) {
                    text += UNPAID;
                } else {
                    text += RETRY_LATER;
                }
                showModal( { text } );
            }
            this.setState( {
                focusRefresh: false
            } )
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } )
    }

    /**
     * 触发警报
    */
    triggerAlarm = () => {
        let { showModal } = this.props;
        sendRaiseAlarmRequest().then( ( { msgId } ) => {
            let text = ALARM_ERROR;
            if ( msgId === MSGIDS.SUCCESS ) {
                //success
                text =  ALARM_SUCCESS;
            } else if ( msgId === MSGIDS.ERROR ) {
                //fail
                text += RETRY_LATER;
            } else if ( msgId === MSGIDS.CONDITION_NOT_MATCH ) {
                //fail
                text += FIND_BACK_NOT_TURNED_ON;
            } else if ( msgId === MSGIDS.ACCESS_ERROR ) {
                //权限不足
                text += UNPAID;
            } else {
                //other msgId
                text += RETRY_LATER;
            }
            showModal( { text } );
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } )

    }

    /**
     * 向手机发送警告短信
    */
    sendMessage = () => {
        let { showModal } = this.props;
        sendSendMessageRequest().then( ( { msgId } ) => {
            let text = SEND_MESSAGE_ERROR;
            if ( msgId === MSGIDS.SUCCESS ) {
                //success
                text = SEND_MESSAGE_SUCCESS;
            } else if ( msgId === MSGIDS.MORE_THAN_MAX ) {
                //fail
                text += SEND_MESSAGE_EXCEEDED_LIMIT;
            } else if ( msgId === MSGIDS.ERROR ) {
                //fail
                text += RETRY_LATER;
            } else if ( msgId === MSGIDS.CONDITION_NOT_MATCH ) {
                //fail
                text += FIND_BACK_NOT_TURNED_ON;
            } else if ( msgId === MSGIDS.ACCESS_ERROR ) {
                text += UNPAID;
            } else {
                //other msgId
                text += RETRY_LATER;
            }
            showModal( { text } );
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } )

    }

    /**
     * 手机找回组件
    */
    render () {
        let { location, mapId, focusRefresh } = this.state;
        return (
            <div className={'findback-container clear'}>
                <div className="findback-left clear">
                    <div className="findback-menu clear shadow">
                        { this.subTitleData.map( ( v, i ) => <SubTitle key={i} {...v} /> ) }
                    </div>
                </div>

                <div className="findback-right">
                    <div className="findback-title">手机找回</div>
                    <Map focusRefresh={focusRefresh} mapId={mapId} location={location} classes={['findback-map','shadow']}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( FindBack ) );
