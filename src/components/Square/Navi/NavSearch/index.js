import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class NavSearch extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            value: ""
        }
        this.changeHandler = this.changeHandler.bind( this );
    }

    changeHandler ( e ) {
        this.setState({value: e.target.value});
    }

    render () {
        return (
            <div className="nav-search-container">
                <input onChange={this.changeHandler} value={this.state.value} placeholder="搜索" type="text" id="search" className="nav-search" />
            </div>
        )
    }
}

export default withRouter( NavSearch );