import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import SessionMenu from './SessionMenu';
import {P2P} from "../../../../../configs/consts";
import {getUserData} from "../../../../../util";
import {getFriendAlias, getPersonById, getTeamById} from "../../../../../redux/store/storeBridge";
import $ from "jquery";

class Header extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            value: "",
            showEdit: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.showEditArea = this.showEditArea.bind(this);
        this.blurHandler = this.blurHandler.bind(this);
    }

    /**
     * 这些都是编辑名称的方法，但编辑功能已删除，只是方法保留
    */
    showEditArea() {
        let nameBefore = this.getNameBefore( this.props.sid );
        !this.state.showEdit && this.setState( {
            showEdit: true,
            value: nameBefore
        } );
    }

    getNameBefore( sid ) {
        let arr = sid.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        return scene === P2P && getFriendAlias( account ) || ( getTeamById( account ) || { name: "" } ).name;
    }

    blurHandler( e ) {
        this.setState( {
            showEdit: false
        } );
        let { sid } = this.props;
        let value = e.target.value,
            arr = sid.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        scene === P2P && this.changeAlias( value, account ) || this.changeTeamName( value, account );
    }

    changeAlias( value, account ) {
        let aliasBefore = getFriendAlias( account );
        if ( value === aliasBefore ) {
            return;
        }
    }

    changeTeamName( value, account ) {
        let nameBefore = ( getTeamById( account ) || {} ).name;
        if ( value === nameBefore ) {
            return;
        }
    }

    changeHandler( e ) {
        this.setState( {
            value: e.target.value
        } );
    }

    /**
     * 获取会话对象群名或备注
    */
    getSessionData( sid, session ) {
        let arr = sid.split( '-' ),
            scene = arr[ 0 ],
            account = arr[ 1 ];
        let name;
        if( scene === P2P )  {
            let data  = getUserData( getPersonById( account ) );
            name = data.alias;
        } else {
            let data = getTeamById( account );
            if ( !data ) {
                name = '';
            } else {
                name = data.name;
            }
        }
        return {
            name
        }
    }

    // getTitle() {
    //     let { sid, session } = this.props;
    //     let { name } = this.getSessionData( sid, session );
    //     let { showEdit, value } = this.state;
    //     return showEdit ? (<input autoFocus={showEdit} className={'session-main-header-edit' + ( showEdit ? " show" : "" )} value={ value } onBlur={this.blurHandler} type="text" onChange={this.changeHandler} />) : (<span className={'session-main-header-name' + ( showEdit ? " hide" : "" )}>{name}</span>)
    // }

    /**
     * 会话面板header部分
    */
    render () {
        let { sid, session } = this.props;
        let { name } = this.getSessionData( sid, session );
        return (
            <div className={"session-main-header"}>
                <span className={ 'session-main-header-name' }>{name}</span>
                {/*showEditArea={this.showEditArea}*/}
                <SessionMenu showHistory={this.props.showHistory} showModal={this.props.showModal} sid={sid}/>
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
)( Header ) );
