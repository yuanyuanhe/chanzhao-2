import React, { Component } from 'react';
import "./index.css";
import MsgItem from '../MsgItem';
import {TIP} from "../../../../../configs/consts";
class EmptyMsgItem extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 无消息的空白页
    */
    render () {
        let msg = {
            type: TIP,
            tip: '暂无消息'
        }
        return (
            <MsgItem msg={msg}/>
        )
    }
}

export default EmptyMsgItem;
