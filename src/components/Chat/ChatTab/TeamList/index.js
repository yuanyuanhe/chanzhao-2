import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getFriendNameList, getNameGroups, getPinYin, getTeamNameList, getUserData} from "../../../../util";
import TeamGroup from "./TeamGroup";
import TabSearch from "../TabSearch";
import TabItem from "../TabItem";
import ScrollContainer from '../../../generics/ScrollContainer';
import {getDefaultTeamAvatar, getTeamAvatar, getTeamById} from "../../../../redux/store/storeBridge";
import {TEAM} from "../../../../configs/consts";
import $ from "jquery";
import {TeamResize, setHeight} from "../index";

const tagClassName = 'tab-team-list';
const defaultAvatar = getDefaultTeamAvatar();
class TeamList extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            words: ""
        }
        this.onChange = this.onChange.bind( this );
        this.resetSearch = this.resetSearch.bind( this );
        this.resetHeight = this.resetHeight.bind( this );
    }

    /**
     * 根据viewport重置面板高度
    */
    resetHeight( node ) {
        if ( !node ) {
            $( window ).off( TeamResize );
            return;
        }
        $( window ).on( TeamResize, setHeight( tagClassName, node ) );
    }

    componentDidMount () {
        $(window).resize();
    }

    /**
     * 按组分类渲染群组组件
    */
    getGroup() {
        let group =  getNameGroups( getTeamNameList( this.props.teamMap ) );
        return group.map( ( v, i ) => {
            if ( v.accounts.length === 0 ) {
                return false;
            }
            return <TeamGroup data={v} key={i} />
        } );
    }

    /**
     * 重置搜索关键字
    */
    resetSearch() {
        this.setState( {
            words: ""
        } );
    }

    /**
     * 搜索关键字changeHandler
    */
    onChange( e ) {
        let words = e.target.value;
        this.setState({
            words
        });
        if ( words === "" ) {
            return;
        }
        //search user
    }

    /**
     * 根据关键字在群组列表中搜索并渲染
    */
    getSearchResult( words ) {
        //search from friends
        let searchKey = getPinYin( words ).toLowerCase(),
            { teamMap } = this.props,
            accounts = [];
        for ( let key in teamMap ) {
            let { name, teamId } = teamMap[key];
            if ( ~getPinYin( name ).toLowerCase().indexOf( searchKey ) ) {
                accounts.push( teamId );
            }
        }
        let classes = ['chat-team-item'];
        return accounts.map( ( v, i ) => {
            let { name } = getTeamById( v );
            let to = `/chat/team/${v}`;
            let avatar = getTeamAvatar( v );
            return (<TabItem account={v} scene={TEAM} resetSearch={this.resetSearch} name={name} to={to} avatar={avatar} classes={classes} key={i} />)
        } )
    }

    /**
     * 通讯录群组列表
     *
    */
    render () {
        let main,
            { words } = this.state;
        if ( words === "" ) {
            main = this.getGroup();
        } else {
            main = this.getSearchResult( words );
        }

        return (
            <div className={"chat-team-list-container"}>
                <TabSearch words={this.state.words} changeHandler={this.onChange} placeholder={"请输入昵称手机号或秘图号"} />
                <div className={"tab-list-wrapper " + tagClassName} ref={this.resetHeight}>
                    <ScrollContainer>
                        { main }
                    </ScrollContainer>
                </div>

            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        teamMap: state.teamMap
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( TeamList ) );
