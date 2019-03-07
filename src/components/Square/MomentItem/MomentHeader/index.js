import React, { Component } from 'react';
import "./index.css";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {getUserCenterRouter, getUserData} from "../../../../util";
import {getPersonById} from "../../../../redux/store/storeBridge";
import Avatar from "../../../generics/Avatar";
import MomentFocusBtn from '../MomentFocusBtn';
import MomentMenu from '../MomentMenu';
class MomentHeader extends Component{
    constructor( props ) {
        super( props );
    }

    jumpToUserCenter = () => {
        let { history, uid } = this.props;
        history.push( getUserCenterRouter( uid ) );
    }
    /**
     * 秘圈header部分，转发说说的header部分不显示菜单部分
     * showMenu： { Boolean } 是否显示菜单部分
     * showModal： { Function } 弹框通用方法
     * avatarClasses： { Array } 定制头像样式的css类名数组
     * uid： { String|Int } 用户account,
     * transportedMid: {String} 被转发说说的mid,
     * filter： { String } 秘圈的种类（世界，推荐等）,
     * mid： {String} 秘圈mid,
     * isTransport： { Boolean } 是否是转发说说,
     * time： {String} 秘圈发布时间,直接显示的字符串
     * isCollect： { Boolean } 是否已被收藏,
     * isFollower： { Boolean } 自己是否已关注发布者
     * showReport： { Function } 显示举报弹框方法
    */
    render () {
        let { showMenu, showModal, avatarClasses, uid, isCollect, transportedMid, filter, mid, isTransport, time, isFollower, showReport } = this.props;
        let { alias, avatar } = getUserData( getPersonById( uid ) );
        return (
            <div className="moment-item-header clear">
                <Avatar clickHandler={this.jumpToUserCenter} classes={avatarClasses} src={avatar} styles={this.avatarStyle} />
                <div className="moment-item-alias-wrapper clear">
                    <em onClick={this.jumpToUserCenter} className="moment-item-alias auto-omit"> { alias } </em>
                    <span className="moment-item-release-time"> {time}</span>
                </div>
                { showMenu ? <MomentMenu showReport={showReport} isTransport={isTransport} showModal={showModal} mid={mid} collected={isCollect} filter={filter} account={uid} transportedMid={transportedMid} /> : false }
                { showMenu ? <MomentFocusBtn showModal={showModal} filter={filter} account={uid} focused={isFollower}/> : false }
            </div>
        )
    }
}
/**
 * 用户数据更新时，刷新此组件
*/
function mapStateToProps( state ) {
    return {
        personlist: state.personlist
    }
}

export default withRouter( connect(
    mapStateToProps
)( MomentHeader ) );
