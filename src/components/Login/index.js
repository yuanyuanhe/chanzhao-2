import React, { Component } from 'react';
import { connect } from 'react-redux';
import {accountLogin, getQueryKey, queryLogin} from "../../requests";
import {setImageRoot, setServerConfig, setServerToken, setUserUID} from "../../redux/actions";
import {initConfig} from "../../configs/initConfig";
import {withRouter} from "react-router-dom";
import { initSDK } from "../../SDK/init";
import './index.css';
import Avatar from '../generics/Avatar';
import QRCodeWrapper from "./QRCodeWrapper";
import QRCode from 'qrcode.react';
import {b64EncodeUnicode, getMsgProfileByLastMsg, isDev} from "../../util";
import $ from 'jquery';
import Push from "push.js";
import {A_P_NOT_MATCH, ACCOUNT_NOT_EXIST, FORMAAT_ERROR, LOGIN_ERROR, PLEASE_INPUT_ACCOUNT, PLEASE_INPUT_PASSWORD, RETRY_LATER} from "../../configs/TIP_TEXTS";
import {MSGIDS} from "../../configs/consts";
const loginMethod = {
    qr: 0,
    ap: 1
}
class Login extends Component {
    constructor( props ) {
        super( props );
        this.loginClickHandler = this.loginClickHandler.bind( this );
        this.accountChangeHandler = this.accountChangeHandler.bind( this );
        this.passwordChangeHandler = this.passwordChangeHandler.bind( this );
        this.state = {
            key: "",
            account: "",
            password: "",
            qrLogin: true,
            accountTip: "",
            passwordTip: ""
        };
        this.protocolUrl = "mitures://QRCode/";
    }

    /**
     * account input element change handler function
    */
    accountChangeHandler( e ) {
        let change = {
            account: e.target.value
        }
        if ( this.state.accountTip !== "" ) {
            change.accountTip = "";
        }
        this.setState( change );
    }

    /**
     * password input element change handler function
    */
    passwordChangeHandler( e ) {
        let change = {
            password: e.target.value
        }
        if ( this.state.passwordTip !== "" ) {
            change.passwordTip = "";
        }
        this.setState( change );
    }

    /**
     * 回车键监听
    */
    checkEnter = ( e ) => {
        if ( e.keyCode == "13" ) {
            this.loginClickHandler();
        }
        return false;
    }

    /**
     * 帐号密码登录点击确认按钮的回调
    */
    async loginClickHandler () {
        // accountLogin( this.state.account || "18037330003", this.state.password || "mitures1" ).then( res => {
        let { account, password } = this.state;
        if ( !account ) {
            return this.setState( {
                accountTip: PLEASE_INPUT_ACCOUNT
            } );
        }
        if ( !password ) {
            return this.setState( {
                passwordTip: PLEASE_INPUT_PASSWORD
            } );
        }
        accountLogin( this.state.account, this.state.password ).then( res => {
            let { msgId } = res;
            if ( msgId !== MSGIDS.SUCCESS ) {
                let tips = {};
                if ( msgId === MSGIDS.PASSWORD_ERROR ) {
                    tips.accountTip = A_P_NOT_MATCH;
                } else if ( msgId === MSGIDS.DATA_NOT_FOUND ) {
                    tips.accountTip = ACCOUNT_NOT_EXIST;
                } else if ( msgId === MSGIDS.ERROR ) {
                    tips.accountTip = LOGIN_ERROR + RETRY_LATER;
                } else if ( msgId === MSGIDS.PARAMS_ERROR ) {
                    tips.accountTip = FORMAAT_ERROR;
                }
                return this.setState( tips );
            }
            this.loginSuccessHandler( res );
        } );
    }

    /**
     * 登录成功回调
     * 设置userUID, serverToken，服务器配置项，图片资源host，初始化IMSDK
     * IMSDK数据同步完毕后跳转到广场
    */
    loginSuccessHandler ( data ) {
        const { history, setReduxUserUID, setReduxServerToken, setReduxServerConfig, setReduxImageRoot } = this.props;
        let { user:{ uid: account, mt_token: sdktoken }, token: serverToken } = data;
        setReduxUserUID( account );
        setReduxServerToken( serverToken );
        initConfig().then( config => {
            setReduxServerConfig( config );
            setReduxImageRoot( config.oss.endpoint )
            clearInterval( this.queryLoginId );
            // init sdk
            initSDK( { appKey: config.yunxin, account, token: sdktoken }, () => history.push( '/square' ) );
        } )
    }

    /**
     * 初始化二维码轮询
    */
    componentDidMount() {
        this.initQueryLogin();
    }

    /**
     * 清除帐号密码登录时未被取消的二维码轮询interval
    */
    componentWillUnmount () {
        clearInterval( this.queryLoginId );
    }

    componentWillMount () {
        this.checkServerToken();
    }

    checkServerToken = () => {
        if ( !!this.props.serverToken ) {
            this.props.history.goForward();
            return false;
        }
        return true;
    }

    /**
     *  初始化二维码并开始扫码轮询
     *  获取二维码key失败则过1秒后重新初始化
    */
    initQueryLogin () {
        if ( !this.checkServerToken() ) {
            return;
        }
        clearInterval( this.queryLoginId );
        this.drawQRCode().then( () => {
            this.timelyQueryLogin();
        } ).catch( ( e ) => {
            if ( isDev() ) {
                console.error( e );
            }
            setTimeout( () => {
                this.initQueryLogin();
            }, 5000 );
        } )
    }

    /**
     * 二维码轮询方法
     * 200： 扫码登录成功
     * 902： 二维码key过期，需要刷新二维码
     * 901： 二维码未被扫描
    */
    timelyQueryLogin() {
        this.queryLoginId = setInterval( async () => {
            let { qrLogin, key } = this.state;
            if ( !qrLogin ) {
                return;
            }
            let res = await queryLogin( key ),
                { msgId } = res;
            if ( msgId === MSGIDS.SUCCESS ) {
                this.loginSuccessHandler( res );
                return;
            }
            if ( msgId === MSGIDS.KEY_EXPIRED ) {//key expired
                this.initQueryLogin();
                return;
            } else if ( msgId === MSGIDS.QRCODE_NOT_BEEN_READ ) {//not be read

            }
        }, 2000 );
    }

    /**
     * 获取二维码key并保存在state中
    */
    async drawQRCode () {
        let msgId, key;
        try{
            ( { msgId, key } = await getQueryKey() );
        } catch( e ) {
            if ( isDev() ) {
                console.log( e );
            }
            this.setState( {
                key: ""
            } ) ;
            return;
        }
        if ( msgId !== MSGIDS.SUCCESS ) {
            this.setState( {
                key: ""
            } ) ;
            throw new Error("get qrcode error");
        }
        this.setState( {
            key
        } ) ;
    }

    /**
     * 修改登录方式，扫码or帐号密码
    */
    changeLoginMethod = ( e ) => {
        // qrLogin
        let { qrLogin } = this.state;
        if ( $( e.target ).data( "method" ) === loginMethod.qr ) {
            !qrLogin && this.setState( {
                qrLogin: true
            } );
        } else {
            qrLogin && this.setState( {
                qrLogin: false
            } );
        }
    }

    /**
     * 登录组件
    */
    render () {
        let { key, qrLogin, account, password, accountTip, passwordTip } = this.state,
            url = b64EncodeUnicode( this.protocolUrl + key );
        return (
            <div className="login-container">
                <div className="login-wrapper ab-middle" id="login" style={ {userSelect: 'text'} } >
                    <div className="login-left"></div>
                    <div className={ "login-right" + ( qrLogin ? " useqr" : "" ) }>
                        {/*nav*/}
                        <div className={"lr-nav"}>
                            <div data-method={loginMethod.ap} onClick={this.changeLoginMethod} className={ "lr-nav-item ap-wrapper" + ( !qrLogin ? " cur" : "" ) }  >帐号登录</div>
                            <div data-method={loginMethod.qr} onClick={this.changeLoginMethod} className={ "lr-nav-item qr-wrapper"+ ( qrLogin ? " cur" : "" ) }>扫码登录</div>
                        </div>
                        {/*main*/}
                        {/*帐号密码登录*/}
                        <div className="login-layout ap-login-layout">
                            <div className="login-ipt-wrapper">
                                <input placeholder={'请输入帐号'} type="text" id={'account'} value={ account } className={'login-ipt'} onChange={this.accountChangeHandler} onKeyDown={this.checkEnter} />
                                { accountTip ?<div className="login-tip auto-omit">{accountTip}</div> : false }
                            </div>
                            <div className="login-ipt-wrapper">
                                <input placeholder={'请输入密码'} type="password" id={'password'} value={ password } className={'login-ipt'} onChange={this.passwordChangeHandler} onKeyDown={this.checkEnter} />
                                { passwordTip ? <div className="login-tip auto-omit">{passwordTip}</div>: false }
                            </div>
                            <button className="login-submit" onClick={this.loginClickHandler}>登录</button>
                        </div>
                        {/* 扫码登录 */}
                        <div className="login-layout qr-login-layout">
                            <div className="qrcode-wrapper ab-middle">
                                 <QRCode size={240} value={ url }/>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="lr-footer">
                            没有帐号？去<a className={'jump-to-register'} target={"blank"} href="https://www.mitures.com/webview/register/register.html">注册</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        serverToken: state.serverToken
    };
}

function mapDispathToProsp( dispatch ) {
    return {
        setReduxUserUID: ( account ) => dispatch( setUserUID( account ) ),
        setReduxServerToken: ( serverToken ) => dispatch( setServerToken( serverToken ) ),
        setReduxServerConfig: ( config ) => dispatch( setServerConfig( config ) ),
        setReduxImageRoot: ( imageRoot ) => dispatch( setImageRoot( imageRoot ) ),
    };
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( Login ) );
