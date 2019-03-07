import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import MainHeader from '../MainHeader';
import Avatar from '../../../generics/Avatar';
import MainAnchor from '../MainAnchor';
import ProfileItem from '../ProfileItem';
import {SEX_MALE} from "../../../../configs/consts";
const maleSex = SEX_MALE;

class SamePart extends Component{
    constructor( props ) {
        super( props );
        this.headerStyle = {
            marginBottom: "90px"
        };
        this.avatarStyle = {
            width: "90px",
            height: "90px",
            margin: "0 auto"
        };
    }

    /**
     * 好友、群组、添加好友右侧可复用部分
     * 包括Header avatar name sex anchors profile
    */
    render () {
        let { name, avatar, deleteHandler, sex, anchors,autograph, profiles, children } = this.props;
        if ( !name ) {
            return <div className={"chat-main-same-part"}></div>
        }
        return (
            <div className={"chat-main-same-part"}>
                <MainHeader styles={this.headerStyle} text={name} deleteHandler={ deleteHandler } />
                <Avatar src={avatar} styles={this.avatarStyle} title={name} alt={name}/>
                <div className="chat-friend-main-alias-container">
                    <span className="chat-friend-main-alias">{name}</span>
                    { !!sex ? <span className={"chat-friend-main-sex-icon " + ( sex === maleSex ? "icon-male" : "icon-female" ) }></span> : false }
                </div>
                <div className="friend-main-autograph">{autograph}</div>
                <div className="friend-main-anchor-container">
                    { anchors.map( (v,i) => (<MainAnchor key={i} data={v} />) ) }
                </div>
                { children }
                <div className={"profile-group"}>
                    { profiles.map( ( v, i ) => (<ProfileItem data={v} key={i} />) ) }
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist,
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
)( SamePart ) );
