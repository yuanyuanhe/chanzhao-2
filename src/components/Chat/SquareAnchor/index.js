import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
class SquareAnchor extends Component{
    constructor( props ) {
        super( props );
        this.jumpToSquare = this.jumpToSquare.bind( this );
    }

    jumpToSquare = () => {
        let { history } = this.props;
        history.push( "/square/recommend" );
    }

    /**
     * 右侧anchor，跳转到广场
    */
    render () {
        return (
            <div className="square-anchor" onClick={this.jumpToSquare}></div>
        )
    }
}

export default withRouter( SquareAnchor );
