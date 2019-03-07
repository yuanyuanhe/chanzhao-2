import React, { Component, Fragment } from 'react';
import "./index.css";
import LabelSelector from './LabelSelector';

class AccessSelector extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showLabelSelector: false
        }

    }

    /**
     * 切换可见性权限点击处理
    */
    clickHandler = ( e ) => {
        let { selectAccess, accessCheck } = this.props,
            node = e.target,
            value = node.attributes['value'].nodeValue;
        !!accessCheck && accessCheck( value, () => {
            !!selectAccess && selectAccess( value );
            if ( value === '2' || value === '-2' ) {
                this.setState( {
                    showLabelSelector: true
                } );
            }
        } );
    }

    /**
     * 隐藏分组选择器
    */
    hideLabelSelector = () => {
        this.setState( {
            showLabelSelector: false
        } );
    }

    /**
     * 权限选择器被隐藏的时候，隐藏分组选择器
    */
    componentWillReceiveProps( nextProps ) {
        if ( !nextProps.show ) {
            this.setState( {
                showLabelSelector: false
            } );
        }
    }

    /**
     * 秘圈可见性权限选择器
     * showSelector: {Function} 显示可见性权限选择器（隐藏分组选择器）
     * access: {String} 当前选择的权限分类
     * selectLabel: {Function} 切换选择分组方法，重复点击则取消之前选择的
     * selectedLabels: {Array} 已经选中的分组数据
    */
    render () {
        let { show } = this.props;
        if ( !show ) {
            return false;
        }
        let { showLabelSelector } = this.state;
        let { showModal, showSelector, access, selectLabel, selectedLabels } = this.props;
        return (
            <Fragment>
                <div className={'access-selector-container clear shadow' + ( showLabelSelector ? " hide" : '' ) }>
                    <div className={ "asc-item" + ( access === "1" ? " cur" : "" ) } onClick={this.clickHandler} value="1">公开</div>
                    <div value="-1" className={ "asc-item" + ( access === "-1" ? " cur" : "" ) } onClick={this.clickHandler}>仅自己可见</div>
                    <div value="2" className={ "asc-item" + ( access === "2" ? " cur" : "" ) } onClick={this.clickHandler}>选中好友可见</div>
                    <div value="-2" className={ "asc-item" + ( access === "-2" ? " cur" : "" ) } onClick={this.clickHandler}>选中好友不可见</div>
                </div>
                <LabelSelector selectLabel={selectLabel} selectedLabels={selectedLabels} hideSelector={this.hideLabelSelector} showAccessSelector={showSelector} showModal={ showModal } show={ showLabelSelector }/>
            </Fragment>
        )
    }
}

export default AccessSelector;
