import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
class UCSearch extends Component{
    constructor( props ) {
        super( props );
    }

    textChangeHandler = ( e ) => {
        let { changeHandler } = this.props;
        !!changeHandler && changeHandler( e.target.value );
    }

    /**
     * 用戶中心搜索組件
     * 需求被砍，留个占位
    */
    render () {
        let { text } = this.props;
        return (
            <div className={'uc-user-search-container clear'}>
                <input type="text" className={'uc-user-search vertical-middle'} onChange={this.textChangeHandler} value={text} placeholder={'输入昵称或备注'} />
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
)( UCSearch ) );
