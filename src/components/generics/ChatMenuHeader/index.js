import React, { Component } from 'react';
import "./index.css";
class ChatMenuHeader extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 聊天和秘圈菜单顶部带阴影和小三角的部分
     * width: 组件宽度
    */
    render () {
        let { width } = this.props;
        return (
            <div style={ { width: `${width}px` } } className={'chat-menu-header'}></div>
        )
    }
}

export default ChatMenuHeader;
