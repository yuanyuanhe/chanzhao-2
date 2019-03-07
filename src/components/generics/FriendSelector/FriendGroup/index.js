import React, { Component } from 'react';
import "./index.css";
import SelectorLine from '../../SelectorLine';
import SelectorItem from '../../SelectorItem';
import {P2P} from "../../../../configs/consts";

class FriendGroup extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 好友选择器中按首字母分类的一组好友，如A，B。。。
     * data: { Object } 帐号组数据
     *       {
     *           key: 分组的key,ABC 其他,
     *           accounts: { Array } 该组下好友帐号数组
     *       }
     * selected: { Array } 已被选中的帐号数组
     * addToSelected: { Function } 好友item点击处理，已选中的就删除，未选中的添加
    */
    render () {
        let { data: { key, accounts = [] }, selected, addToSelected } = this.props;
        return (
            <div className={'selector-group selector-friend-group'}>
                <SelectorLine groupName={key}/>
                { accounts.map( ( v, i ) => {
                    return <SelectorItem selected={selected} addToSelected={addToSelected} account={v} key={i} type={P2P} />
                } ) }
            </div>
        )
    }
}

export default FriendGroup;
