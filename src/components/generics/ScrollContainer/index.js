import React, { Component } from 'react';
import "../../../plugins/css/perfect-scrollbar.css";
import PerfectScrollbar from 'perfect-scrollbar';
import './index.css';
class ScrollContainer extends Component{
    constructor( props ) {
        super( props );
        this.initScroll = this.initScroll.bind( this );
    }

    initScroll( node ){
        !!node ? this.ps = new PerfectScrollbar( node ): false;
        let { toBottom, getScrollNode } = this.props;
        if ( toBottom ) {
            !!node && ( node.scrollTop = node.scrollHeight );
        }
        if ( getScrollNode ) {
            getScrollNode( node );
        }
    }

    componentWillUnmount() {
        this.ps ? this.ps.destroy() : false;
    }

    /**
     * 可滚动区域，用perfectScrollbar定制了滚动条的样式
     * 宽度高度继承了其父组件的值，使用时需要在外面包一层控制区域大小的组件
    */
    render () {
        return (
            <div className={"scroll-container"} ref={this.initScroll}>
                { this.props.children }
            </div>
        )
    }
}

export default ScrollContainer;
