import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";

import Logo from '../../generics/Logo';
import Avatar from '../../generics/Avatar';
import HomeAnchor from './HomeAnchor';
import NavSearch from './NavSearch';
import NavSetting from './NavSetting';
import NavNotification from './NavNotification';
import {getUserCenterRouter, getUserData} from "../../../util";
import {getPersonById} from "../../../redux/store/storeBridge";

class Navi extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 跳转到userUID的用户中心
    */
    jumpToMyUserCenter = () => {
        let { history, uid, location: { pathname } } = this.props;
        let toUrl = getUserCenterRouter( uid );
        if ( pathname !== toUrl ) {
            history.push( toUrl );
        }
    }

    /**
     * 广场导航条组件
     * uid: {String|Int} 用户uid
    */
    render () {
        let { avatar, name } = getUserData( getPersonById( this.props.uid ) );
        return (
            <Fragment>
                <div className={"navi-container shadow"}>
                    <div className={"navi-wrapper"}>
                        <Logo/>
                        <HomeAnchor/>
                        {/*<NavSearch/>*/}
                        <Avatar clickHandler={this.jumpToMyUserCenter} src={avatar} title={name} alt={name} classes={['nav-avatar','vertical-middle']} />
                        <NavNotification/>
                        <NavSetting/>
                    </div>
                </div>
                <div className="navi-line"></div>
            </Fragment>

        )
    }
}

function mapStateToProps( state ) {
    return {
        uid: state.userUID,
        personlist: state.personlist
    }
}

export default withRouter( connect(
    mapStateToProps
)( Navi ) );