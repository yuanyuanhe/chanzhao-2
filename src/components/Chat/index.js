import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import Loadable from "react-loadable";
import {checkHost} from "../../util";
import ChatMain from './ChatMain';
import ChatTab from './ChatTab';
import ChatMenu from './ChatMenu';
import SquareAnchor from './SquareAnchor';
import './index.css';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';

const containerResize = 'resize.containerResize';
const coverResize = 'resize.coverResize';
const classNameOfSmallScreen = ' small-screen';
const classNameOfCoverSmallScreen = ' split';
const classNameOfCoverSmallScreenButLargeWidth = ' horizontal';//low height but high width
const classNameOfCoverSmallScreenButLargeHeight = ' vertical';//low height but high width

class Chat extends Component {
    constructor( props ) {
        super( props );
        this.resize = this.resize.bind( this );
        this.resizeCover = this.resizeCover.bind( this );
        this.inputChange = this.inputChange.bind( this );
        this.state = {
            words: {}
        };
        this.fileId = 'file-' + Date.now();
    }

    /**
     * 改变chat-container组件宽高样式class
    */
    toggleClass( node ) {
        let innerHeight = window.innerHeight;
        let className = node.className;
        let reg = new RegExp( classNameOfSmallScreen, "g" );
        if( innerHeight <= 1048 ) {
            if ( !reg.test( className ) ) {
                node.className = className + classNameOfSmallScreen;
            }
        } else {
            node.className = className.replace( reg, "" );
        }
    }

    /**
     * 改变chat-cover元素宽高样式class
    */
    toggleCoverClass( node ) {
        let innerHeight = window.innerHeight;
        let innerWidth = window.innerWidth;
        let className = node.className;
        let reg = new RegExp( classNameOfCoverSmallScreen, "g" );
        let regLW = new RegExp( classNameOfCoverSmallScreenButLargeWidth, "g" );
        // let regLH = new RegExp( classNameOfCoverSmallScreenButLargeHeight, "g" );
        if( innerHeight > 1048  && innerWidth > 1240 ) {
            if ( !reg.test( className ) ) {
                className = className + classNameOfCoverSmallScreen;
            }
            if ( regLW.test( className ) ) {
                className = className.replace( regLW, "" );
            }
            // if ( regLH.test( className ) ) {
            //     className = className.replace( regLH, "" );
            // }
            node.className = className;
        } else {
            if ( innerWidth < 1240 ) {
                className = className.replace( regLW, "" );
            } else {
               if ( !regLW.test( className ) ) {
                    className = className + classNameOfCoverSmallScreenButLargeWidth;
                }
            }
            // if ( innerHeight < 1000 ) {
            //     className = className.replace( regLH, "" );
            // } else {
            //    if ( !regLH.test( className ) ) {
            //         className = className + classNameOfCoverSmallScreenButLargeHeight;
            //     }
            // }
            node.className = className.replace( reg, "" );
        }
    }

    /**
     * 主动触发window的resize事件
     * 根据屏幕现在的大小设置宽高
    */
    componentDidMount () {
        $(window).resize();
    }

    /**
     * chat container 元素ref方法
     * 添加resize handler
    */
    resize( node ) {
        if ( !node ) {
            $( window ).off( containerResize );
            return;
        }
        $(window).on( containerResize, () => {
            if ( !/chat-container/g.test( node.className ) ) {
                return;
            }
            this.toggleClass( node );
        } );
    }

    /**
     * 根据屏幕宽高设置chat cover元素的宽高
    */
    resizeCover ( node ) {
        if ( !node ) {
            $( window ).off( coverResize );
            return;
        }
        $(window).on( coverResize, () => {
            if ( !/chat-cover/g.test( node.className ) ) {
                return;
            }
            this.toggleCoverClass( node );
        } );
    }

    /**
     * 聊天输入框的changeHandler
     * 根据sessionId保存每一个会话的聊天草稿
    */
    inputChange( sid, word ) {
        this.setState( {
            words: {
                ...this.state.words,
                [sid]: word
            }
        } );
    }

    /**
     * 聊天部分主组件
     * ChatMenu： 左侧菜单
     * ChatTab: sessionlist那一块
     * ChatMain: 聊天面板等主组件
    */
    render () {
        let { showModal } = this.props;
        return (
            <Fragment>
                <SquareAnchor/>
                <div className="chat-cover split horizontal" id="chat" ref={this.resizeCover} >
                    <ChatMenu/>
                    <div className="chat-container" ref={this.resize}>
                        <ChatTab showModal={showModal} $form={this.$form}  fileId={this.fileId}/>
                        <ChatMain showModal={showModal} inputChange={ this.inputChange } words={this.state.words} fileId={this.fileId}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispatchToProps( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispatchToProps
)( Chat ) );