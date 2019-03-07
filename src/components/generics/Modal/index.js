import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import Alert from '../Alert';
import Confirm from '../Confirm';
import Prompt from '../Prompt';
import ModalContainer from '../ModalContainer';
import { MODAL_ALERT, MODAL_PROMPT, MODAL_CONFIRM, MODAL_REPOST } from '../../../configs/consts'

class Modal extends Component{
    constructor( props ) {
        super( props );
    }

    getModify() {
        let { type } = this.props.match.params,
            { state } = this.props.location,
            { callback, cancelCallback, preLocation } = this.props,
            children;
        switch( type ) {
            case MODAL_ALERT:
                children = <Alert preLocation={preLocation} callback={callback} state={ state|| {} }/>;
                break;
            case MODAL_CONFIRM:
                children = <Confirm preLocation={preLocation} cancelCallback={cancelCallback} callback={callback} state={ state|| {} }/>;
                break;
            case MODAL_PROMPT:
                children = <Prompt preLocation={preLocation} cancelCallback={cancelCallback} callback={callback} state={ state|| {} }/>;
                break;
            default:
                children = false;
        }

        return <ModalContainer zIndex={99999999}>
            {children}
        </ModalContainer>
    }

    /**
     * 模态框包装组件，包装了三种通用模态框，详情见子组建内部
    */
    render () {
        return (
            this.getModify()
        )
    }
}

/**
 * get location to show modifies
 * @param curLocation { Object }
*/
export function getModalLocation( { type, title, text, curLocation, inputType, autoReplace } ) {
    return {
        pathname:`/modal/${type}`,
        state:{
            modal: true,
            title,
            text,
            inputType,
            autoReplace,
            preLocation: curLocation || { pathname: "/" }
        }
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( Modal ) );
