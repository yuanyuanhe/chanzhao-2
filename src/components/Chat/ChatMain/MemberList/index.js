import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getTeamById, getTeamMembers,getTeamOwner} from "../../../../redux/store/storeBridge";
import MemberItem from "./MemberItem";
import MemberProfile from "./MemberProfile";
import ScrollContainer from "../../../generics/ScrollContainer";
import MemberSelector from "./MemberSelector";
import {teamMembers} from "../../../../redux/reducers/teamMembers";
import {friendlist} from "../../../../redux/reducers/friends";
import {sendAddTeamMemberRequest} from "../../../../requests";
import {MSGIDS} from "../../../../configs/consts";
import {ADD_TEAM_MEMBER_ERROR, ADD_TEAM_MEMBER_SUCCESS, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";

class MemberList extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            cur: undefined,
            showVerify: false,
            selected: []
        }
        this.showAddMemberVerify = this.showAddMemberVerify.bind( this );
        this.addToSelected = this.addToSelected.bind( this );
        this.selectCallback = this.selectCallback.bind( this );
    }

    /**
     * 选择成员完毕后的确认按钮点击处理
    */
    selectCallback() {
        let { teamId, showModal } = this.props;
        let { selected } = this.state,
            owner = getTeamOwner( teamId );
        sendAddTeamMemberRequest( { teamId, members: selected, owner } ).then( ( { msgId } ) => {
            if( msgId === MSGIDS.SUCCESS ) {
                showModal( { text: ADD_TEAM_MEMBER_SUCCESS } );
            } else {
                showModal( { text: ADD_TEAM_MEMBER_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } )
        this.setState( {
            selected: [],
            showVerify: false
        } );
    }

    /**
     * 编辑群成员用： 添加群成员到缓存（submit按钮点击后再向服务器发请求）
    */
    addToSelected( account ) {
        let selected = this.state.selected.slice(0),
            index = selected.indexOf( account );
        if ( !~index ) {
            selected.push( account )
        } else {
            selected.splice( index, 1 );
        }
        this.setState( {
            selected
        } );
    }

    /**
     * 显示添加成员确定按钮
    */
    showAddMemberVerify() {
        let { teamId } = this.props;
        this.setState( {
            showVerify: !this.state.showVerify
        } )
    }

    /**
     * 获取所有成员的account数组，过滤好友中已在此群中的帐号
    */
    getFiltered( members ) {
        let res = [];
        members.forEach( ( { account } ) => {
            res.push( account )
        } );
        return res;
    }

    /**
     * 群组详情面板 展示群成员列表组件
     * 包括添加群成员功能
     * cleanCur: {Function} 清空当前被选中的成员
     * show: {Boolean} 显示/隐藏群列表开关
    */
    render () {
        let { classes, teamId, show = false, showModal, cleanCur } = this.props;
        classes = !!classes && classes.join( ' ' ) || "";
        if ( !show ) {
            return false;
        }
        let { name } = getTeamById( teamId ) || {},
            { members } = getTeamMembers( teamId ) || {};
        //hide memberlist if member data is not in cache
        if ( !name || !members ) {
            return false;
        }
        let filtered = this.getFiltered( members );
        return (
            <div className={'member-list-container clear shadow ' + classes} style={{ display: !!show && "block" || "none" }}  onMouseLeave={cleanCur}>
                <div className="member-list-header">
                    成员
                    <span className={'member-list-add-member'} onClick={this.showAddMemberVerify}></span>
                    <MemberSelector showModal={showModal} filtered={filtered} zIndex={2} selected={this.state.selected} addToSelected={this.addToSelected} show={ this.state.showVerify } callback={this.selectCallback} />
                </div>
                <div className="member-list clear">
                    <ScrollContainer>
                        { !!members ?
                            members.map( ( v, i ) => <MemberItem cur={this.props.cur} changeCur={this.props.changeCur} data={v} key={i}/> ) :
                            false
                        }
                    </ScrollContainer>
                </div>
                <MemberProfile showModal={showModal} account={this.props.cur}/>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        teamMap: state.teamMap,
        members: state.teamMembers,
        personlist: state.personlist,
        friendlist: state.friendlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( MemberList ) );
