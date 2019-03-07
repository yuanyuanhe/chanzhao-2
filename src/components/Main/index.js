import React, { Component } from 'react';
import Loadable from "react-loadable";
// import {store} from "../../redux/store";
import {withRouter} from 'react-router-dom';
// import { Provider } from 'react-redux'
import {  Route, Switch } from "react-router-dom";
import {getServerToken} from "../../redux/store/storeBridge";
import "./index.css"
import Modal from '../generics/Modal'
import Report, {getReportLocation} from '../generics/Report'
import { getModalLocation } from "../generics/Modal";
import {MODAL_ALERT, HISTORY_PUSH, HISTORY_REPALCE, REPORT_MOMENT} from '../../configs/consts';
import LoadingElement from '../generics/Loading';
const Loading = () => <LoadingElement/>;
let Login = Loadable( {
    loader: () => import( '../Login' ),
    loading: Loading
} );

let Square = Loadable( {
    loader: () => import( '../Square' ),
    loading: Loading
} );

let FindBack = Loadable( {
    loader: () => import( '../FindBack' ),
    loading: Loading
} );

let Chat = Loadable( {
    loader: () => import( '../Chat' ),
    loading: Loading
} );

class Main extends Component{
    constructor( props ) {
        super( props );
        this.checkToken( props );
        this.showModal = this.showModal.bind( this );
        this.showReport = this.showReport.bind( this );
        this.state = {
            isModal: false
        }
    }

    componentDidMount () {
        let event = new CustomEvent( 'modal', { 'showModal': this.showModal } );
    }

    checkToken ( props ) {
        let { history, location: { pathname } } = props;
        if ( !getServerToken() && pathname !== '/' ) {
            history.replace("/");
        }
    }

    //show modify modals
    /**
     * type: modal type: alert confirm or prompt
     * changeHistoryType: method to replace location: push or replace
     * other params' detail show in Modal components
    */
    showModal( { type, title = "", text = "", callback = undefined, cancelCallback = undefined, curLocation, changeHistoryType, inputType, autoReplace = true } ) {
        type = type || MODAL_ALERT;
        changeHistoryType = changeHistoryType || HISTORY_REPALCE;
        curLocation = curLocation || this.props.location;
        this.setState( {
            callback,
            cancelCallback
        } );
        this.props.history[changeHistoryType]( getModalLocation( { type, title, text, curLocation, inputType, autoReplace } ) );
    }

    /**
     * 举报方法，子组件内调用
    */
    showReport( { text, type, callback = undefined, cancelCallback = undefined, curLocation, changeHistoryType, autoReplace = true } ) {
        type = type || REPORT_MOMENT;
        changeHistoryType = changeHistoryType || HISTORY_REPALCE;
        curLocation = curLocation || this.props.location;
        this.setState( {
            callback,
            cancelCallback
        } );
        this.props.history[changeHistoryType]( getReportLocation( { text, type, curLocation, autoReplace } ) );
    }

    /**
     * token清空则永远留在'/'对应的登录组件
    */
    componentWillUpdate( nextProps ) {
        this.checkToken( nextProps );
    }

    /**
     * 入口组件，主组件，包含一切，神罗天征！
    */
    render () {
        const { location } = this.props;
        let isModal =  location.state &&
            location.state.modal &&
            location.state.preLocation !== location;
        let preLocation = location.state &&
            location.state.modal &&
            location.state.preLocation;
        let callback = undefined,
            cancelCallback = undefined;
        if ( isModal ) {
            callback = this.state.callback;
            cancelCallback = this.state.cancelCallback;
        }

        return (
            <div className={"main"}>
                <Switch location={isModal ? preLocation : location}>
                    <Route path="/square" render={ () => <Square showReport={this.showReport} showModal={ this.showModal } /> } />
                    <Route path="/chat" render={() => <Chat showModal={ this.showModal } />} />
                    <Route exact path="/" render={() => <Login showReport={this.showReport} showModal={ this.showModal } />} />
                </Switch>
                { <Route exact path={'/modal/:type'} render={() => <Modal preLocation={preLocation} cancelCallback={ cancelCallback } callback={ callback }/> } /> }
                {/* type: showReport type default is moment */}
                { <Route exact path={'/report/:type'} render={() => <Report preLocation={preLocation} cancelCallback={ cancelCallback } callback={ callback }/> } /> }
                <audio style={ { display:"none" } } id="tip-music">
                    {/* <!-- web-project/mitures/audio/audio_end_tip.wav -->*/}
                    <source src={"web/assests/audio/beaff75af163a0780759af0ab277d57f.wav".checkSrcHost()} type="audio/wav"/>
                </audio>
            </div>
        );
    }
}

export default withRouter( Main );