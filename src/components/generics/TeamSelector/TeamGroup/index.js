import React, { Component } from 'react';
import "./index.css";
import SelectorLine from '../../SelectorLine';
import SelectorItem from '../../SelectorItem';
import {TEAM} from "../../../../configs/consts";

class TeamGroup extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 群选择器中群按首字母分组
     * selected: {Array} 已被选中的群组id数组
     * data: {Object} 该群组数据
     *     {
     *         key: 分组首字母A-Z&others,
     *         account: 群组id
     *     }
    */
    render () {
        let { data: { key, accounts = [] }, selected } = this.props;
        return (
            <div className={'selector-group selector-team-group'}>
                <SelectorLine groupName={key}/>
                { accounts.map( ( { v, i } ) => {
                    return <SelectorItem selected={selected} addToSelected={this.props.addToSelected} account={v} key={i} type={TEAM} />
                } ) }
            </div>
        )
    }
}

export default TeamGroup;
