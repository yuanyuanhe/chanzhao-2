import React, { Component } from 'react';
import "./index.css";
class SelectorSearch extends Component{
    constructor( props ) {
        super( props );
    }

    changeHandler = ( e ) => {
        let { changeText } = this.props;
        !!changeText && changeText( e.target.value );
    }

    /**
     * 好友/群组选择器的搜索框
     * text: {String} 用户输入的文本
     * changeText: {Function} 文本changeHandler
    */
    render () {
        let { text, placeholder } = this.props;
        return (
            <div className={'selector-search-container clear'}>
                <input placeholder={placeholder} value={text} onChange={this.changeHandler} type="text" className={'selector-search-input'} />
            </div>
        )
    }
}

export default SelectorSearch;
