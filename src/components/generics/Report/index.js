import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
import {sendGetFeedBackTypesRequest, sendFeedBackRequest} from "../../../requests";
import ModalContainer from '../ModalContainer';
import MenuHeader from '../MenuHeader';
import SelectCircle from '../SelectCircle';
import {ICON_CANCEL} from "../../../configs/iconNames";
import {MSGIDS} from "../../../configs/consts";
class Report extends Component{
    constructor( props ) {
        super( props );
        this.clickHandler = this.clickHandler.bind( this );
        this.state = {
            report_types: [],
            report_text: "",
            report_id: 0
        }
    }

    closeModal = () => {
        let { history, preLocation } = this.props;
        history.replace( preLocation );
    }

    clickHandler() {
        let { callback, preLocation, location: { state: { autoReplace } } } = this.props;
        if ( !!callback ) {
            let { report_text, report_id } = this.state;
            callback( report_id, report_text );
            !!autoReplace && this.closeModal();
        } else {
            this.closeModal();
        }
    }

    changeReportText = ( e ) => {
        this.setState( {
            report_text: e.target.value
        } );
    }

    //获取可以举报的类型等数据
    componentWillMount() {
        let { location: { state: { autoReplace } }, history } = this.props;
        sendGetFeedBackTypesRequest().then( ( { msgId, message, report_types } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    report_types
                } );
            } else {
                console.log( msgId, message )
            }
        } ).catch( e => {
            console.log( e )
        } )
    }

    selectReportReason = ( e ) => {
        let node = e.target;
        if ( !/report-type-item/.test( node.className ) ) {
            node = node.parentNode;
        }
        let report_id = parseInt( node.dataset.id ),
            { report_id: curId } = this.state;
        if ( report_id === curId ) {
            return;
        }
        this.setState( {
            report_id
        } );
    }

    /**
     * 举报组件，目前只用于举报秘圈，举报用户时可复用
     * callback: 确认按钮点击回调
     * location: 110行 getReportLocation方法返回的对象
     *
    */
    render () {
        let { callback, location: { state: { text } } } = this.props;
        let { report_types, report_text, report_id } = this.state;
        return (
            <ModalContainer zIndex={9999999}>
                <div className={'modal-wrapper shadow report-container'}>
                    <div className="report-title">
                        <MenuHeader text={'举报'} closeHandler={this.closeModal} />
                    </div>
                    <div className="report-content">{text}</div>
                    { report_types.map( ( {report_type_id, description}, i ) => {
                        let selected = report_id === report_type_id;
                       return <div data-id={report_type_id} key={i} onClick={this.selectReportReason} className={ ( selected ? "cur ": '' ) + 'report-type-item' }>
                        {description}
                        <SelectCircle selected={selected} />
                        </div>
                    } ) }
                    <div className="report-input-wrapper">
                        <textarea value={report_text} onChange={this.changeReportText} placeholder={'请详细填写，以确保举报能够及时被审理（字数不超过200个字符）'} type="text" className="report-input" />
                    </div>
                    <div className="modal-btn-wrapper report-btn-wrapper">
                        <button className={'modal-btn modal-submit report-btn'} onClick={this.clickHandler}>举报</button>
                    </div>
                </div>
            </ModalContainer>

        )
    }
}

export default withRouter(Report);

export function getReportLocation( { text, type, curLocation, autoReplace } ) {
    return {
        pathname:`/report/${type}`,
        state:{
            modal: true,
            autoReplace,
            text,
            preLocation: curLocation || { pathname: "/" }
        }
    }
}