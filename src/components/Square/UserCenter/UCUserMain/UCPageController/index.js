import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import UCPageItem from './UCPageItem';
class UCPageController extends Component{
    constructor( props ) {
        super( props );
    }

    getPages ( cur, sum ) {
        let pages = [ cur - 2, cur - 1, cur, cur + 1, cur + 2 ];
        let res = [];
        pages.forEach( ( item, index ) => {
            if ( item > 1 && item < sum ) {
                res.push( item );
            }
        } );

        return res;
    }

    getFrontEllipsis() {
        let { curPage } = this.props;
        return curPage < 5 ? false : this.ellipsis;
    }

    getEndEllipsis() {
        let { cur, pageNum, onChangePage, curPage } = this.props;
        return pageNum - curPage > 3 ? this.ellipsis : false;
    }

    get ellipsis () {
        return <span className={'uc-page-item'}>...</span>
    }

    /**
     * 页码控制器
     * cur: {String} 当前用户类型
     * pageNum: {Number} 总页数
     * onChangePage: {Function} 修改页码方法
     * curPage: {Number} 当前页码
    */
    render () {
        let { cur, pageNum, onChangePage, curPage } = this.props;

        return (
            <div className={"uc-page-controller-container"}>
                <span className={"uc-page-item prev-page" + ( curPage === 1 ? " cant-click" : "" )} onClick={onChangePage.bind( null, curPage - 1 )}>上一页</span>
                <UCPageItem curPage={curPage} num={1} changeHandler={onChangePage} />
                { this.getFrontEllipsis() }
                { this.getPages( curPage, pageNum ).map( ( v, i ) => <UCPageItem curPage={curPage} key={i} num={v} changeHandler={onChangePage} /> ) }
                { this.getEndEllipsis() }
                { pageNum === 1 ? false : <UCPageItem curPage={curPage} num={pageNum} changeHandler={onChangePage} />}
                <span className={"uc-page-item next-page" + ( curPage === pageNum ? " cant-click" : "" )} onClick={onChangePage.bind( null, curPage + 1 )}>下一页</span>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( UCPageController ) );
