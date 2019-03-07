import React, { Component } from 'react';
import "./index.css";
class UCPageItem extends Component{
    constructor( props ) {
        super( props );
    }

    changePage = () => {
        let { num , changeHandler } = this.props;
        !!changeHandler && changeHandler( num );
    }

    /**
     * 页码item
     * num: {Number} 此组件的页数
     * curPage: {Number} 当前被选中的页码
    */
    render () {
        let { num, curPage } = this.props;
        return (
            <span onClick={this.changePage} className={'uc-page-item' + ( curPage == num ? ' cur' : '' )}>
                { num }
            </span>
        )
    }
}

export default UCPageItem;
