import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css'
import SettingItem from './SettingItem';
import {store} from "../../../../redux/store";
import {setServerToken, toggleSwitchs} from "../../../../redux/actions";
import {DESKTOP, SOUND} from "../../../../configs/consts";
import {ICON_CANCEL} from "../../../../configs/iconNames";
import {getMtsdk} from "../../../../redux/store/storeBridge";
class NavSetting extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            ifShow: false
        }
        let { history } = this.props;
        let hideMenu = this.hideMenu;
        this.settingList = [
            {
                text: "手机找回",
                callback: function () {
                    history.push( '/square/findback' );
                    hideMenu();
                }
            },{
                text: "",
                callback: function () {
                    store.dispatch( toggleSwitchs( DESKTOP ) );
                    hideMenu();
                }
            },{
                text: "",
                callback: function () {
                    store.dispatch( toggleSwitchs( SOUND ) );
                    hideMenu();
                }
            },{
                text: "退出登录",
                callback: function () {
                    store.dispatch( setServerToken( "" ) );
                    getMtsdk().disconnect();
                    history.push( "/" );
                    hideMenu();
                }
            }
        ]
        this.iconClickHandler = this.iconClickHandler.bind( this )
    }

    iconClickHandler ( e ) {
        if ( /icon-setting/.test( e.target.className ) ) {
            this.setState( {
                ifShow: !this.state.ifShow
            } );
        }
    }

    hideMenu = () => {
        if ( !this.state.ifShow ) {
            return;
        }
        this.setState( {
            ifShow: false
        } )
    }

    render () {
        let { ifShow } = this.state;
        let { SOUND, DESKTOP } = this.props.switchs;
        this.settingList[ 1 ].text = ( DESKTOP ? "关闭" : "开启" ) + "桌面通知";
        this.settingList[ 2 ].text = ( SOUND ? "关闭" : "开启" ) + "声音";
        return (
            <div className={"vertical-middle icon-setting" + ( ifShow ? " cur" : "" ) } id="icon-setting" onClick={this.iconClickHandler} >
                <div className="setting-list shadow clear">
                    <div className="square-setting-header">
                        设置 <img onClick={this.hideMenu} className={'square-setting-close vertical-middle'} src={ICON_CANCEL.convertIconSrc()} alt="" title="关闭" />
                    </div>
                    <div className="square-setting-list-wrapper">
                        { this.settingList.map( v => <SettingItem key={ v.text } text={v.text} callback={v.callback} /> ) }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        switchs: state.switchs
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( NavSetting ) );
