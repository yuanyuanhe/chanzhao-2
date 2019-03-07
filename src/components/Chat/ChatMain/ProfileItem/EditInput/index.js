import React, { Component } from 'react';
import "./index.css";

class EditInput extends Component{
    constructor( props ) {
        super( props );
        this.autoFocus = this.autoFocus.bind( this );
        this.state = {
            text: this.props.text
        }
        this.changeValue = this.changeValue.bind( this );
    }

    changeValue( e ) {
        this.setState( {
            text: e.target.value
        } );
    }

    autoFocus( node ) {
        !!node ? node.focus() : false;
    }

    render () {
        let { blurHandler, text = '备注' } = this.props;
        return (
            <div className={"edit-input-container clear"} >
                <input onBlur={blurHandler} className={"edit-input"} type="text" onChange={ this.changeValue } value={ this.state.text } placeholder={ text } ref={this.autoFocus} />

            </div>
        )
    }
}

export default EditInput;
