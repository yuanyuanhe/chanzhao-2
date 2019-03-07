import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css';
class SettingItem extends Component{
    constructor( props ) {
        super( props );
    }

    render () {
        let { text, callback } = this.props;
        return (
            <div className={"setting-item"} onClick={callback}>
                { text }
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

export default SettingItem;

// export default withRouter( connect(
//     mapStateToProps,
//     mapDispathToProsp
// )( Example ) );
