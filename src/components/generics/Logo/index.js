import React, { Component } from 'react';
import {checkHost, checkSrcHost} from "../../../util";
import logo from '../../../configs/icons.scss';
import './index.css'

let logoSrc = 'mitures_logo.png';
let wordSrc = 'mitures_word.png';

class Logo extends Component{
    constructor( props ) {
        super( props );
    }

    /**
     * 导航条logo组件（写的时候考虑到其他地方可能会用到，实际上并没有）
    */
    render () {
        return (
            <div className={"logo-container"}>
                <img className={"logo-img"} src={logoSrc.convertIconSrc()} alt="" title="秘图" />
                <img className={"logo-text"} src={wordSrc.convertIconSrc()} alt="" title="秘图" />
            </div>
        )
    }
}

export default Logo;