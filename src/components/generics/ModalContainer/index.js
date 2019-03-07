import React, { Component } from 'react';
import "./index.css";
class ModalContainer extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * position fixed 全屏半透明遮罩层，一般用于模态框或其他弹出窗口背景
     * zIndex：{ Number( INT ) } 组件的z-index属性值
     * children: react children 属性
    */
    render () {
        let { zIndex = 0 } = this.props
        return (
            <div className={'modal-container'} style={ !!zIndex ? { zIndex } : {} } >
                { this.props.children }
            </div>
        )
    }
}

export default ModalContainer;
