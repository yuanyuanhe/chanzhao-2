import React, { Component } from 'react';
import './index.css';
class Avatar extends Component{
    constructor( props ) {
        super( props );
        this.loadHandler = this.loadHandler.bind( this );
    }

    loadHandler ( e ) {
        let target = e.target,
            className = target.className;
        if ( target.width <= target.height ) {
            className += " avatar-vertical-middle";
        } else {
            className += " avatar-horizontal-middle";
        }
        target.className = className;
    }

    clickHandler = ( e ) => {
        let { clickHandler } = this.props;
        !!clickHandler && clickHandler();
    }

    /**
     * 水平垂直居中显示图片组件，主要用于头像显示，其他类似的需求也可以使用
     * classes: {Array} 引用组件自定义的css类名数组，引用组件需要定制样式时使用
     * styles: { Object } 引用组件自定义样式对象，作用和classes类似，样式较少时可以使用
     * src: { image Link }图片完整链接
     * alt: { String } 图片alt属性
     * title: { String } 图片title属性
     * clickHandler： { Function } 图片的点击回调方法
    */
    render () {
        let { classes, styles = {}, src, alt = "", title = "" } = this.props;
        let className = "avatar-container ";
        if ( !!classes ) {
            className += classes.join( ' ' );
        }
        return (
            <div className={ className } style={ styles } onClick={this.clickHandler}>
                <img src={ src } onLoad={this.loadHandler} alt={ alt } title={ title } />
            </div>
        )
    }
}

export default Avatar;