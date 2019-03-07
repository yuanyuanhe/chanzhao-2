import React, { Component } from 'react';
import { withRouter,Route,Switch } from 'react-router-dom';
import {connect} from "react-redux";
import Loadable from "react-loadable";
import './index.css'
import TabSearch from './TabSearch';
import {getSearchWords} from "../../../redux/store/storeBridge";
import {store} from "../../../redux/store";
import {setSearchWords} from "../../../redux/actions";
import PerfectScrollbar from 'perfect-scrollbar';
import '../../../plugins/css/perfect-scrollbar.css';
import ScrollConatiner from '../../generics/ScrollContainer';
import LoadingElement from '../../generics/Loading';
const Loading = () => <LoadingElement/>;
let SessionList = Loadable( {
    loader: () => import('./SessionList'),
    loading: Loading
} );
let FriendList = Loadable( {
    loader: () => import('./FriendList'),
    loading: Loading
} );
let TeamList = Loadable( {
    loader: () => import('./TeamList'),
    loading: Loading
} );
let AddFriend = Loadable( {
    loader: () => import('./AddFriend'),
    loading: Loading
} );
class ChatTab extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 聊天主面板左侧list区域，展示会话列表，好友列
    */
    render () {
        let { showModal } = this.props;
        return (
            <div className="chat-tab" >
                <Switch>
                    <Route path='/chat/session' render={ () => (<SessionList showModal={showModal} fileId={this.props.fileId} />) } />
                    <Route path='/chat/friend' component={FriendList} />
                    <Route path='/chat/team' component={TeamList} />
                    <Route path='/chat/add' render={ () => ( <AddFriend showModal={ showModal }/> ) } component={AddFriend} />
                </Switch>
            </div>
        )
    }
}

export const FriendResize = 'resize.friendResize';
export const SessionResize = 'resize.sessionResize';
export const TeamResize = 'resize.teamResize';
export const AddResize = 'resize.addResize';

export function setHeight( className, node ) {
    let reg = new RegExp( className, 'g' );
    return function () {
        let className = node.className;
        if ( !reg.test( className ) ) {
            return;
        }
        let innerHeight = window.innerHeight;
        let innerwidth = window.innerWidth;
        if ( innerHeight < 600 ) {
            //240
            node.style.height = 600 - 90 + 'px';
        }
        if ( innerHeight > 600 && innerHeight <= 1000 ) {
            //240
            node.style.height = innerHeight - 90 + 'px';
        } else if ( innerHeight > 1000 ) {
            if ( innerwidth > 1240 ) {//split
                node.style.height = 1048 - 90 + 'px';
            } else {
                node.style.height = innerHeight - 90 + 'px';
            }
        }
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( ChatTab ) );
