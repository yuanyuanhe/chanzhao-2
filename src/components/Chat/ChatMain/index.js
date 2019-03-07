import React, { Component } from 'react';
import { withRouter,Route,Switch } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css';
import Loadable from "react-loadable";
import LoadingElement from '../../generics/Loading';

const Loading = () => <LoadingElement/>;
let SessionMain = Loadable( {
    loader: () => import('./SessionMain'),
    loading: Loading
} );
let FriendMain = Loadable( {
    loader: () => import('./FriendMain'),
    loading: Loading
} );
let TeamMain = Loadable( {
    loader: () => import('./TeamMain'),
    loading: Loading
} );
let AddMain = Loadable( {
    loader: () => import('./AddMain'),
    loading: Loading
} );
let ChatEmptyPage = Loadable( {
    loader: () => import('./ChatEmptyPage'),
    loading: Loading
} );
class ChatMain extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 聊天会话面板，好友详情等主面板部分
    */
    render () {
        let { showModal } = this.props;
        return (
            <div className="chat-main">
                <Switch>
                    <Route path='/chat/session/:sessionId' render={() => ( <SessionMain showModal={showModal} fileId={this.props.fileId} inputChange={this.props.inputChange} words={this.props.words}/> )} />
                    <Route path='/chat/friend/:account' render={() => <FriendMain showModal={showModal}/>} />
                    <Route path='/chat/team/:teamId' render={() => <TeamMain showModal={showModal}/>} />
                    <Route path='/chat/add/:account' render={() =><AddMain showModal={showModal} /> } />
                    {/* empty pages */}
                    <Route path='/chat/' render={() =><ChatEmptyPage showModal={showModal} /> } />
                </Switch>
            </div>
        )
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
)( ChatMain ) );
