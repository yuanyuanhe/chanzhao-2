import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import ModalContainer from '../../../../generics/ModalContainer';
import FriendSelector from '../../../../generics/FriendSelector'
class MemberSelector extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 编辑群组成员数据
     * 复用FriendSelector组件
    */
    render () {
        let { selected, addToSelected, show, zIndex, filtered, callback } = this.props;
        if ( !show ) {
            return false;
        }
        return (
            <ModalContainer zIndex={zIndex}>
                <FriendSelector filtered={filtered} classes={['member-selector-container','clear','ab-middle','shadow']} selected={selected} addToSelected={addToSelected} show={show} callback={callback}/>
            </ModalContainer>
        )
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( MemberSelector ) );
