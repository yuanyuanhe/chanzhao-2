import React, { Component } from 'react';
import "./index.css";
import { MITURE_TOPIC_ICON_CANCEL } from '../../../configs/iconNames';

class SelectedItem extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 好友选择器中被选中的好友在右边显示的item
     * deleteHandler: 删除按钮点击处理方法
     * name： 显示的名称
     * account： 帐号，用于调用删除方法
    */
    render () {
        let { deleteHandler, name, account } = this.props;
        return (
            <span className={'selector-selected-item'}>
                <span className="selector-selected-name">
                    {name}
                </span>
                <img onClick={deleteHandler.bind(this, account)} src={MITURE_TOPIC_ICON_CANCEL.convertIconSrc()} alt="删除" title="删除" />
            </span>
        )
    }
}

export default SelectedItem;
