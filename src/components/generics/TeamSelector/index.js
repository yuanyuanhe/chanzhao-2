import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import ModalContainer from '../ModalContainer';
import TeamGroup from './TeamGroup';
import { getNameGroups, getTeamNameList} from "../../../util";

class TeamSelector extends Component{
    constructor( props ) {
        super( props );
    }

    filterTeams() {
        let { filtered = [] } = this.props,
            res = {},
            teamMap = this.props.teamMap;
        if ( filtered.length === 0 ) {
            return teamMap;
        }
        for( let key in teamMap ) {
            if( !~filtered.indexOf( key ) ) {
                res[ key ] = teamMap[ key ]
            }
        }
        return res;
    }

    /**
     * 群组选择器，现在暂时没有地方那个用到，可能会在秘圈转发到聊天的时候用到
     * selected: {Array} 已被选中的群id数组
     * addToSelected: {Function} 群item点击回调
    */
    render () {
        let { selected = [], addToSelected } = this.props;
        let teamMap = this.filterTeams();
        let group = getNameGroups( getTeamNameList( teamMap ) );
        return (
            <ModalContainer>
                <div className={'team-selector clear'}>
                    { group.map( ( v, i ) => {
                        if ( v.accounts.length === 0 ) {
                            return false;
                        }
                        return <TeamGroup addToSelected={addToSelected} selected={selected} data={v} key={i}/>
                    } ) }
                </div>
            </ModalContainer>
        )
    }
}

function mapStateToProps( state ) {
    return {
        teamMap: state.teamMap
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( TeamSelector ) );
