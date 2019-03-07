import React, { Component } from 'react';
import "./index.css";
import { ICON_TALK_DELETE_ACTIVE,ICON_TALK_DELETE_COMMON } from '../../../../configs/iconNames';
const activeSrc = ICON_TALK_DELETE_ACTIVE.convertIconSrc();
const commonSrc = ICON_TALK_DELETE_COMMON.convertIconSrc();
class MainHeader extends Component{
    constructor( props ) {
        super( props );
        this.commonTheImg = this.commonTheImg.bind( this );
        this.activeTheImg = this.activeTheImg.bind( this );
    }

    /**
     * 鼠标放上去显示active状态图片
    */
    activeTheImg( e ){
        e.target.src = activeSrc;
    }

    /**
     * 鼠标离开后改回一般状态src
     * 可以改成元素的背景图
    */
    commonTheImg( e ){
        e.target.src = commonSrc;
    }

    getDeleteIcon() {
        let { deleteHandler } = this.props;
        if ( !deleteHandler ) {
            return false;
        }
        return <img className={"chat-main-header-delete"} src={commonSrc} alt="" title="" onClick={ deleteHandler } onMouseOver={ this.activeTheImg } onMouseLeave={ this.commonTheImg } />
    }

    /**
     * 详情 header部分
     * deleteHandler: {Function} 如果存在删除功能，则是删除方法 同时显示删除icon
     * text: {String } header文本
     * styles: {Object} 自定义样式
    */
    render () {
        let { deleteHandler, text, styles } = this.props,
            deleteIcon = this.getDeleteIcon();
        return (
            <div className={"chat-main-header"} style={styles}>
                <span className={"chat-main-header-text"}>{text}</span>
                { deleteIcon }
            </div>
        )
    }
}

export default MainHeader;
