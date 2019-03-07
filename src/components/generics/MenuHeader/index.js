import React, { Component } from 'react';
import "./index.css";
import {ICON_CANCEL} from "../../../configs/iconNames";
class MenuHeader extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 菜单组件的header,带关闭的叉
     * closeHandler:{Function} 叉点击处理方法，一般是关闭
     * text: {String} 标题文字
     * classes: {Array} 引用组件定制样式用css类名数组
    */
    render () {
        let { closeHandler, text, classes=[] } = this.props;
        return (
            <div className={ 'menu-header auto-omit ' + ( classes.join( ' ' ) ) }>
                { text }
                <img onClick={closeHandler} src={ICON_CANCEL.convertIconSrc()} alt="" title="关闭" className="menu-close vertical-middle" />
            </div>
        )
    }
}

export default MenuHeader;
