import React, { Component } from 'react';
import "./index.css";
import {SEX_MALE} from "../../../configs/consts";
class SexAndNumber extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 性别和昵称在一行的小组件 用的地方不少拆分出来
     * sex: {String} SEX_MALE || SEX_FEMALE 性别
     * number: {String} 秘图号
     * classes: {Array} 引用组件自定义样式时使用的类名数组
    */
    render () {
        let { sex, number, classes=[] } = this.props;
        return (
            <div className={'sex-number-line ' + classes.join( " " ) }>
                <span className={"snl-sex-icon " + ( sex === SEX_MALE ? "snl-male" : "snl-female" ) }></span>
                <span className="snl-number">{ number || " " }</span>
            </div>
        )
    }
}

export default SexAndNumber;
