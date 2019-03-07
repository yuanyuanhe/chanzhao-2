import React, { Component } from 'react';
import SessionItem from './SessionItem/index';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getMtsdk, getPersonById, getSessions} from "../../../../redux/store/storeBridge";
import {getPinYin, getSceneAndAccountBySID, getUserData} from "../../../../util";
import TabSearch from '../TabSearch';
import './index.css';
import ScrollContainer from '../../../generics/ScrollContainer';
import $ from "jquery";
import {SessionResize, setHeight} from "../index";
import FriendSelector from '../../../generics/FriendSelector';
import {setCurrentSessionId, setSessionList} from "../../../../redux/actions";
import {sendCreateTeamRequest} from "../../../../requests";
import { IMUtil } from "../../../../SDK/IMUtil";
import {checkTeamMemberUserData, checkUsersData} from "../../../../util/user";
import {MSGIDS} from "../../../../configs/consts";
import {CREATE_TEAM_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";

const P2P = "p2p";
const TEAM = "team";
const tagClassName = 'tab-session-list';
class SessionList extends Component {
    constructor ( props ) {
        super( props );
        this.state = {
            words: "",
            showMemberSelector: false,
            selectedAccounts: []
        }
        this.onChange = this.onChange.bind( this );
        this.resetSearchWords = this.resetSearchWords.bind( this );
        this.resetHeight = this.resetHeight.bind( this );
        this.showAddPart = this.showAddPart.bind( this );
        this.addToSelected = this.addToSelected.bind( this );
        this.selectedSubmit = this.selectedSubmit.bind( this );
    }

    /**
     * 根据viewport重置面板高度
    */
    resetHeight( node ) {
        if ( !node ) {
            $( window ).off( SessionResize );
            return;
        }
        $( window ).on( SessionResize, setHeight( tagClassName, node ) );
    }

    componentDidMount () {
        $(window).resize();
    }

    /**
     * 搜索关键字change handler
    */
    onChange( e ) {
        let words = e.target.value;
        this.setState({
            words
        });
    }

    /**
     * 根据session获取其名称
    */
    getNames( id ) {
        let arr = id.split( "-" ),
            type = arr[ 0 ],
            account = arr[ 1 ];
        if ( type === P2P ) {
            let { alias, name } = getUserData( getPersonById( account ) );
            return [ getPinYin( alias ).toLowerCase(), getPinYin( name ).toLowerCase() ];
        } else if ( type === TEAM ) {
            let { name } = this.props.teamMap[ account ];
            return [ getPinYin( name ).toLowerCase() ];
        } else {
            return [];
        }
    }

    /**
     * 根据关键字在会话列表中搜索会话
    */
    getSearchResult( words ){
        let searchKey = getPinYin( words ).toLowerCase(),
            results = [],
            sessions = this.props.sessions;
        sessions.forEach( v => {
            let { id } = v,
                names = this.getNames( id );
            names.find( item => {
                return ~item.indexOf( searchKey )
            } ) ? results.push( v ) : "";
        } );
        return results;
    }

    /**
     * 重置搜索关键字
    */
    resetSearchWords() {
        this.setState( {
            words: ""
        } );
    }

    /**
     * 显示添加好友部分
    */
    showAddPart(){
        let { showMemberSelector } = this.state;
        if ( !showMemberSelector ) {
            this.setState( {
                showMemberSelector: true
            } );
        } else {
            this.setState( {
                showMemberSelector: false,
                selectedAccounts: []
            } );
        }

    }

    /**
     * 选择成员方法，复选取消
    */
    addToSelected( account ) {
        let selected = this.state.selectedAccounts.slice(0),
            index = selected.indexOf( account );
        if ( !~index ) {
            selected.push( account )
        } else {
            selected.splice( index, 1 );
        }
        this.setState( {
            selectedAccounts: selected
        } );
    }

    /**
     * 选择成员确定按钮点击回调
     * 选择单人开始和此人聊天，选择多人则创建群聊
    */
    selectedSubmit() {
        let { selectedAccounts, showMemberSelector } = this.state;
        let { showModal } = this.props;
        if( selectedAccounts.length === 0 ) {

        } else if ( selectedAccounts.length === 1 ) {
            let account = selectedAccounts[ 0 ],
                sessions = getSessions();
            let cur = sessions.find( ({ id }) => {
                let accid = id.split("-")[1];
                return accid === account;
            } );
            if ( !cur ) {//no existed session
                this.createSession( "p2p", account ).then( () => {
                    this.startChatWith( "p2p-" + account );
                } );
            } else {
                this.startChatWith( cur.id );
            }
        } else {
            //if need input team name
            sendCreateTeamRequest( { name: "群聊" + Date.now(), accounts: selectedAccounts } ).then( ( { msgId, team } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {

                } else {
                    showModal( { text: CREATE_TEAM_ERROR + RETRY_LATER } );
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
                console.log( e );
            } )
        }
        this.setState( {
            showMemberSelector: false,
            selectedAccounts: []
        } );
    }

    /**
     * 创建会话，存在SDK bug, 同步下来的session list中不存在某会话，创建时却提示会话已存在
    */
    createSession( scene, to ) {
        let mtsdk = getMtsdk();
        return mtsdk.insertLocalSession( { scene, to } ).then( ( { session } ) => {
            let sessions = getSessions();
            this.props.setSessionList( IMUtil.mergeSessions( sessions, session ) )
        } );
    }

    /**
     * 跳转到对应会话面板
    */
    startChatWith( sessionId ) {
        this.props.history.replace( `/chat/session/${sessionId}` );
        this.props.setCurrentSessionId( sessionId );
    }

    /**
     * 组件装载前加载会话列表中涉及的好友帐号，暂不拉去涉及的群组帐号
    */
    componentWillMount() {
        let { sessions } = this.props;
        let teams = [],
            users = [];
        sessions.forEach( ( { id: sid } ) => {
            let { scene, account } = getSceneAndAccountBySID( sid );
            if ( scene === TEAM ) {
                // 群组暂不拉取成员数据
                // checkTeamMemberUserData( id );
            } else {
                users.push( account );
            }
        } );
        checkUsersData( users );
    }

    /**
     * 隐藏成员选择器
    */
    hideMemberSelector = () => {
        this.setState( {
            showMemberSelector: false,
            selectedAccounts: []
        } );
    }

    /**
     * 会话列表组件
     * sessions: {Array} 当前会话列表数据
    */
    render () {
        let sessions,
            { words, showMemberSelector, selectedAccounts } = this.state;
        if ( words === "" ) {
            sessions = this.props.sessions;
        } else {
            sessions = this.getSearchResult( words );
        }
        return ( <div className={"session-list"}>
            <TabSearch showAddPart={this.showAddPart} showAdd={true} words={this.state.words} changeHandler={this.onChange} placeholder={"请输入昵称手机号或秘图号"} />
            <div className={"tab-list-wrapper " + tagClassName} ref={this.resetHeight}>
                <ScrollContainer>
                    { sessions.map( ( item ) => {
                        return <SessionItem key={ item.id } data={ item } resetSearchWords={this.resetSearchWords}  fileId={this.props.fileId}/>
                    } ) }
                </ScrollContainer>
            </div>
            { showMemberSelector ? <FriendSelector selected = {selectedAccounts} addToSelected={this.addToSelected} show={showMemberSelector} classes={['start-chat-container']} cancelCallback={this.hideMemberSelector} callback={this.selectedSubmit}/> : false }
        </div> );
    }
}

const mapStateToProps = ( state ) => {
  return {
      personlist: state.personlist,
      friends: state.friendlist,
      teamMap: state.teamMap,
      sessions: state.sessions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setSessionList: ( sessionlist ) => dispatch( setSessionList( sessionlist ) ),
      setCurrentSessionId: ( sessionId ) => dispatch( setCurrentSessionId( sessionId ) )
  }
}

export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)( SessionList ) )
