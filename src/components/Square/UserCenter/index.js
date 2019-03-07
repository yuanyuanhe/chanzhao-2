import React, { Component } from 'react';
import { withRouter,Switch,Route } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import UCHeader from './UCHeader';
import UCUserAnchor from './UCUserAnchor';
import UCProfileItem from './UCProfileItem';
import UCUserMain from './UCUserMain';
import UCMomentMain from './UCMomentMain';
import {getPersonById, getUserUID} from "../../../redux/store/storeBridge";
import {getUserData} from "../../../util";
import {sendGetFocusUserAndFollowerNumRequest} from "../../../requests";
import SubTitle from '../../generics/SubTitle';

import { ICON_PRESONAL_COLLECTION, ICON_PRESONAL_HOMEPAGE, ICON_PERSONAL_INFORMATION } from '../../../configs/iconNames';
import {checkUsersData} from "../../../util/user";
class UserCenter extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            focusNum: 0,
            followerNum: 0,
            friendNum: 0,
            userAnchor: [
                {
                    type: "focus",
                    text: "关注",
                    num: 0
                }, {
                    type: "follower",
                    text: "粉丝",
                    num: 0
                }]
        };
    }

    componentWillMount() {
        checkUsersData( [ this.props.match.params.account ] )
        this.refreshUserNum();
    }

    /**
     * 刷新各类用户（粉丝，关注，好友）的数量
    */
    refreshUserNum() {
        this.getFocusAndFollowerNum();
        this.setState( {
            friendNum: this.props.friendlist.length
        } )
    }

    /**
     * 获取用户资料部分渲染用数据
    */
    getUserDatas( account ) {
        let userData = getUserData( getPersonById( account ) );
        if ( !userData ) {
            return [];
        }
        let userDatas = [
            { key: "name", type: "用户名" },
            { key: "mt_number", type: "秘图号" },
            { key: "sex", type: "性别" },
            { key: "autograph", type: "签名" },
            { key: "phone", type: "手机号码" },
            { key: "lv", type: "会员" },
            { key: "birthday", type: "生日" },
            { key: "area", type: "地区" }
        ];
        userDatas.forEach( ( v ) => {
            v.value = userData[ v.key ];
        } );
        return userDatas;
    }

    /**
     * 获取用户关注部分item渲染用数据
    */
    getUserAnchors ( account ) {
        let anchorData = [
            {
                type: "focus",
                text: "关注",
                iconSrc: "",
                num: this.state.focusNum,
                to: `/square/userCenter/${account}/users/focus`
            }, {
                type: "follower",
                text: "粉丝",
                iconSrc: "",
                num: this.state.followerNum,
                to: `/square/userCenter/${account}/users/follower`
            }
        ]
        if ( account == this.props.userUID ) {
            anchorData.push( {
                type: "friend",
                text: "好友",
                iconSrc: "",
                num: this.state.friendNum,
                to: `/square/userCenter/${account}/users/friend`
            } )
        }
        return anchorData;
    }

    /**
     * 获取Moment Center部分subTitle渲染用数据
    */
    getAnchors ( account ) {
        let userUID = getUserUID(),
            anchors = [
                {
                    account,
                    text: ( account == userUID ? "我" : "TA" ) + "的主页",
                    iconSrc: ICON_PRESONAL_HOMEPAGE,
                    to: "/square/userCenter/" + account + "/moments/user"
                }
            ];
        if ( account == userUID ) {
            anchors.push( {
                account,
                iconSrc: ICON_PRESONAL_COLLECTION,
                text: "我的收藏",
                to: "/square/userCenter/" + account + "/moments/collection"
            } );
        }
        return anchors;
    }

    /**
     * 获取关注和粉丝的人数
    */
    getFocusAndFollowerNum () {
        let account = this.props.match.params.account;
        sendGetFocusUserAndFollowerNumRequest( account ).then( res => {
            this.setState( {
                focusNum: res.focusUser,
                followerNum: res.follower
            } );
        } )
    }

    /**
     * 获取subTitle渲染用数据
    */
    getProfileData( account ) {
        return {
            account,
            iconSrc: ICON_PERSONAL_INFORMATION,
            text: "个人资料",
        }
    }

    /**
     * 用户中心组件
     * match.params.account: {String} 用户中心的用户account
     * showTransportArea: {Function} 显示转发模态框方法
     * showReport: {Function} 显示举报模态框
    */
    render () {
        let account = this.props.match.params.account;
        let anchorPart,
            path = this.props.location.pathname;
        let { showModal, showTransportArea, showReport } = this.props;
        if ( /moment/i.test(path) ) {
            anchorPart = <div className="uc-user-anchor-list">
                { this.getUserAnchors( account ).map( ( v, i ) => ( <UCUserAnchor data={ v } key={ i } /> ) ) }
            </div>
        } else {
            anchorPart = this.getAnchors( account ).map( ( v, i ) => ( <SubTitle { ...v } key={ i } /> ));
        }
        return (
            <div className="user-center-container clear">
                <div className="uc-tab clear">
                    <UCHeader showModal={showModal} account={account} />
                    { anchorPart }
                    <div className="uc-personal-data clear shadow">
                        <SubTitle {...this.getProfileData( account )} />
                        <div className="uc-personal-data-list clear">
                            { this.getUserDatas( account ).map( ( v, i ) => ( <UCProfileItem data={v} key={i} /> ) ) }
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path="/square/userCenter/:account/users/:type" render={() => <UCUserMain showModal={showModal}/> } />
                    <Route path="/square/userCenter/:account/moments/:type" render={() => <UCMomentMain showReport={showReport} showTransportArea={showTransportArea} showModal={showModal}/> } />
                </Switch>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist,
        userUID: state.userUID,
        friendlist: state.friendlist
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    // mapDispathToProsp
)( UserCenter ) );
