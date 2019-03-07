import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import {getUserData} from "../../../../util";
import {getFriendAlias, getPersonById, getUserUID, isFriend} from "../../../../redux/store/storeBridge";
import Avatar from '../../../generics/Avatar';
import SexAndNumber from '../../../generics/SexAndNumber';
import HeadBtnLine from './HeadBtnLine';
import {sendUserIsFocusedRequest} from "../../../../requests";
import {MSGIDS} from "../../../../configs/consts";
import {REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";
class UCHeader extends Component{
    constructor( props ) {
        super( props );
        this.avatarStyle = {
            width: "80px",
            height: "80px",
            margin: "0 auto"
        }
        this.state = {
            canChat: false,
            focused: false
        }
    }

    componentWillMount() {
        let { account } = this.props;
        this.refreshState( account );
    }

    /**
     * account切换的时候刷新组件状态（切换用户）
    */
    componentWillReceiveProps( nextProps ) {
        this.refreshState( nextProps.account )
    }

    /**
     * 刷新状态
    */
    refreshState = ( account ) => {
        if ( account == getUserUID() ) {
            return;
        }
        sendUserIsFocusedRequest( account ).then( ( { msgId, focused, message } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    focused
                } );
            } else {
                this.setState( {
                    focused: false
                } );
            }
        } ).catch( e => {
            console.log( e );
            this.props.showModal( { text: REQUEST_ERROR } );
        } ).finally( () => {
            let canChat = false;
            if ( isFriend( account ) ) {
                canChat = true;
            } else {
                canChat = false;
            }
            this.setState( {
                canChat
            } );
        } )
    }

    /**
     * 用户中心左上角部分
    */
    render () {
        //make sure data is not null before render
        let userUID = getUserUID(),
            account = this.props.account,
            data = getUserData( getPersonById( account ) || {} );
        let { focused, canChat } = this.state;
        let { showModal } = this.props;
        let { avatar = "", mt_number = "", sex } = data,
            name;
        if ( isFriend( account ) ) {
            name = data.alias;
        } else {
            name = data.name || ""
        }
        return (
            <div className="uc-header-container">
                <div className="uc-header-layout clear vertical-middle">
                    <Avatar styles = { this.avatarStyle } src={avatar} alt = {name} title = {name}/>
                    <div className="uc-header-name">{name}</div>
                    <div className="uc-header-mtnum">
                        <SexAndNumber classes={['c-white']} sex={sex} number={mt_number}/>
                    </div>
                    { account == userUID ? false : <HeadBtnLine showModal={showModal} refreshState={this.refreshState} account={account} focused={focused} /> }
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        personlist: state.personlist
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( UCHeader ) );
