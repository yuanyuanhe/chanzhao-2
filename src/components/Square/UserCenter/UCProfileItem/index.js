import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
class UCProfileItem extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 用户中心左下方，用户资料item
     * data: {Object}
     *     {
     *         type: {String} key
     *         value: {String} value
     *     }
    */
    render () {
        let { type = "", value = "" } = this.props.data;
        return (
            <div className="uc-profile-item-container clear">
                <div className="uc-profile-item-type">{ type }</div>
                <div className="uc-profile-item-value">{ value }</div>
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
)( UCProfileItem ) );
