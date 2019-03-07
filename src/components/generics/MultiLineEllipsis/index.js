import React, { Component } from 'react';
import "./index.css";
class MultiLineEllipsis extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showEllipsis: false
        }
    }

    getTextNode = ( node ) => {
        this.textNode = node;
    }

    getContainerNode = ( node ) => {
        this.containerNode = node;
    }

    componentDidMount() {
        if ( !this.textNode || !this.containerNode ) {
            return;
        }
        if ( this.textNode.offsetHeight > this.containerNode.offsetHeight ) {
            this.setState( {
                showEllipsis: true
            } );
        }
    }

    /**
     * 多行文本显示区域，超过显示区域部分省略号省略
     * text: {String} 需要显示的文本
     * classes: {Array} 引用组件自定义样式用css类名
     * bgColor: {String( css color value )} 文本区域背景色以及省略号部分背景色（为了保持背景色一致）
    */
    render () {
        let { text, classes, bgColor } = this.props;
        let { showEllipsis } = this.state;
        return (
            <div className={"ellipsis " + ( classes.join( " " ) )} ref={this.getContainerNode}>
                <div className="ellipsis-container" ref={this.getTextNode}>
                    {text}
                </div>
                <div className={"ellipsis-more" + ( showEllipsis ? " show" : "" )} style={{backgroundColor: bgColor}}>...</div>
            </div>
        )
    }
}

export default MultiLineEllipsis;
