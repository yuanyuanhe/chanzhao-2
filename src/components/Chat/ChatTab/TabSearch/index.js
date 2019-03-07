import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import './index.css';
import { ICON_TALK_ADD } from '../../../../configs/iconNames';

class TabSearch extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 获取显示好友列表然后选择好友开始会话的按钮，只在sessionList中显示
    */
    getAdd() {
        let { showAdd, showAddPart } = this.props;
        if ( !showAdd ) {
            return false;
        }
        return <img onClick={showAddPart} src={ICON_TALK_ADD.convertIconSrc()} alt="开始聊天" title="开始聊天" />
    }

    /**
     * chat tab 左上部搜索框
    */
    render () {
        let addPart = this.getAdd();
        return (
            <div className="chat-tab-item tab-search-container">
                <input value={this.props.words} onChange={this.props.changeHandler} type="text" placeholder={this.props.placeholder || ""} />
                { addPart }
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        searchWords: state.searchWords
    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( TabSearch ) );
