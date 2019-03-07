import React, { Component } from 'react';
import "./index.css";
import {sendGetAllTopicsRequest} from "../../../../requests";
import { ICON_CANCEL } from '../../../../configs/iconNames';
import {MSGIDS} from "../../../../configs/consts";
import {GET_TOPIC_ERROR, REQUEST_ERROR, RETRY_LATER} from "../../../../configs/TIP_TEXTS";

class TopicSelector extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            topics: []
        }
    }

    /**
     * 获取所有话题并渲染
    */
    componentWillMount() {
        sendGetAllTopicsRequest().then( ( { msgId, topics } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    topics
                } );
            } else {
                this.props.showModal( { text: GET_TOPIC_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            this.props.showModal( { text: REQUEST_ERROR } );
        } )
    }

    /**
     * 话题item点击处理
    */
    selectHandler = ( e ) => {
        let { selectTopic, topic } = this.props,
            node = e.target,
            topic_id  = node.attributes['value'].nodeValue,
            text = node.innerHTML;
        if ( topic === text ) {
            return false;
        }
        selectTopic( text, topic_id );
    }

    /**
     * 隐藏话题选择器
    */
    hideClickHandler = () => {
        let { hideSelector } = this.props;
        !!hideSelector && hideSelector();
    }

    /**
     * 标签changeHandler
    */
    labelChangeHandler = ( e ) => {
        let { changeLabel } = this.props;
        !!changeLabel && changeLabel( e.target.value );
    }

    /**
     * 话题选择器
     * curTopic: {String} 当前被选中的话题
     * label: {String} 用户输入的秘圈标签
     * show: {Boolean} 话题选择器显示开关
     * hideSelector: {Function} 隐藏话题选择器方法
     * selectTopic: {Function} 选择话题方法
     * changeLabel: {Function} 修改秘圈标签方法
     * showModal: {Function} 弹框通用方法
    */
    render () {
        let { curTopic, label, show, hideSelector, selectTopic, changeLabel, showModal } = this.props;
        let { topics } = this.state;
        if ( !show ) {
            return false;
        }
        return (
            <div className={'topic-selector-container clear shadow'}>
                <div className="tsc-header">
                    <img src={ICON_CANCEL.convertIconSrc()} alt="关闭" title="关闭" className="tsc-close" onClick={this.hideClickHandler} />
                </div>
                <input value={label} onChange={this.labelChangeHandler} placeholder={'输入感兴趣的话题'} type="text" className="tsc-label-ipt" />
                <div className="tsc-title">相关分类</div>
                { topics.map( ( { topic_id, topic}, i ) => <span style={ ( ( i + 1 ) % 3  !== 0 ) ? {} : {marginRight: 0} } className={'tsc-item' + ( topic === curTopic ? " cur" : '' )} key={i} onClick={this.selectHandler} value={topic_id}>{topic}</span>   ) }
                <div className="tsc-submit" onClick={this.hideClickHandler}>确定</div>
            </div>
        )
    }
}

export default TopicSelector;
