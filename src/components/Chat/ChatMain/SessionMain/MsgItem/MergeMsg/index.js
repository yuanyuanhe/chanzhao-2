import React, { Component, Fragment } from 'react';
import "./index.css";
import {getMsgProfileByLastMsg} from "../../../../../../util";
import ModalContainer from '../../../../../generics/ModalContainer';
import MenuHeader from '../../../../../generics/MenuHeader';
import ScrollContainer from '../../../../../generics/ScrollContainer';
import {ICON_CANCEL} from "../../../../../../configs/iconNames";
import ForwardMsgItem from "./ForwardMsgItem";
class MergeMsg extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showMessageModal: false
        }
    }

    showForwardMessages = () => {
        this.setState( {
            showMessageModal: true
        } );
    }

    hideForwardMessgaes = () => {
        this.setState( {
            showMessageModal: false
        } );
    }

    /**
     * 合并转发类型消息
     * data: {Object} 消息数据
     *     {
     *         title: {String} 标题
     *         subTitle: {String} 子标题
     *         forwardMessage: {Array} 被转发的消息数组
     *     }
    */
    render () {
        let { data: { title, subTitle, forwardMessage } } = this.props;
        let { showMessageModal } = this.state;
        let cache = forwardMessage.slice( 0, 3 );
        return (
            <Fragment>
                <div onClick={this.showForwardMessages} className={"msg-item merge-msg"}>
                    { title + subTitle }
                    { cache.map( ( msg, i ) => {
                        return getMsgProfileByLastMsg( msg );
                    } ) }
                    { forwardMessage.length > 3 ? "..." : false }
                </div>
                {
                    showMessageModal ? <ModalContainer>
                        <div className="forward-msgs-container ab-middle shadow">
                            <div className="forward-msgs-header-wrapper">
                                <MenuHeader classes={['forward-msgs-header']} closeHandler={this.hideForwardMessgaes} text={title}/>
                            </div>
                            <div className="forward-msgs-list-wrapper">
                                <ScrollContainer>
                                    { forwardMessage.map( ( msg, i ) => <ForwardMsgItem data={msg} key={i}/> ) }
                                </ScrollContainer>
                            </div>


                        </div>
                    </ModalContainer> : false
                }
            </Fragment>

        )
    }
}

export default MergeMsg;
