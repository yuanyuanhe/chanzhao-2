import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import MomentItem from '../../MomentItem';
import UCEmptyPage from '../UCUserMain/UCEmptyPage';
import MomentProvider from '../../MomentProvider';
import {getUserUID} from "../../../../redux/store/storeBridge";
import {getCollectedMoments, getUserCenterMoments} from "../../../../requests";
import SegmentedBar from "../../../generics/SegmentedBar";
import {COLLECTION, HOME, MOMENT_TITLE} from "../../../../configs/TIP_TEXTS";
const keys = {
    user: "user",
    collection: "collection"
}
class UCMomentMain extends Component{
    constructor( props ) {
        super( props );
        let userUID = getUserUID(),
            { account, type } = this.props.match.params;
        this.state = {

        };
        if ( account == userUID ) {
            this.state.navBars = [
                {
                    key: keys.user,
                    text: HOME,
                },{
                    key: keys.collection,
                    text: COLLECTION,
                } ];
        } else {

        }
        this.changeMomentType = this.changeMomentType.bind( this );
    }

    /**
     * 如果是查看自己的用户中心，可以切换收藏和秘圈中心两种状态
    */
    changeMomentType( type ) {
        if ( type === this.props.match.params.type ) {
            return;
        } else {
            let account = this.props.match.params.account;
            this.props.history.replace( `/square/userCenter/${account}/moments/${type}` );
        }
    }

    /**
     * 用户重新查看用户秘圈部分
     * 复用momentProvider
    */
    render () {
        let num = 0,
            title,
            userUID = getUserUID(),
            { showModal, showTransportArea, showReport } = this.props,
            { type:cur, account } = this.props.match.params;
        if ( account != userUID ) {
            title = <div className={"uc-moment-title"}>{MOMENT_TITLE}</div>
        } else {
            title = <SegmentedBar items={this.state.navBars} cur={cur} onCurChange={this.changeMomentType}/>
        }

        return (
            <div className="uc-moment-main clear">
                <div className="uc-moment-main-navbar shadow">
                    { title }
                </div>
                <div className="uc-moment">
                    <MomentProvider showReport={showReport} uid={account} showTransportArea={showTransportArea} filter={cur} showModal={showModal}/>
                </div>
            </div>
        )
    }
}

export default withRouter( UCMomentMain );
