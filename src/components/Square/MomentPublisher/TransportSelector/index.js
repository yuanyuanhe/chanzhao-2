import React, { Component } from 'react';
import "./index.css";
class TransportSelector extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 转发权限选择器
     * allow: {Boolean} 当前秘圈转发权限：是否允许转发
     * show: {Boolean} 选择器显示开关
     * toggleAllow: {Function} 切换转发权限方法
    */
    render () {
        let { allow, show, toggleAllow } = this.props;
        if ( !show ) {
            return false;
        }
        return (
            <div className={'transport-controller-container clear shadow'}>
                <div className={"tcc-wrapper vertical-middle" + ( !allow ? "" : " allow" )}>
                    <div onClick={toggleAllow} className="tcc-item"></div>
                </div>

            </div>
        )
    }
}

export default TransportSelector;
