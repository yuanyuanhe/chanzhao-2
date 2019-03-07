import React, { Component } from 'react';
import "./index.css";
import ImageMsg from '../ImageMsg';
import TextMsg from '../TextMsg';
import { FILE } from '../../../../../../configs/iconNames';
import {_$escape} from "../../../../../../util";

const unit = 1024;
const decimalNum = 2;
class FileMsg extends Component{
    constructor( props ) {
        super( props );
    }

    //file.size 以byte为单位
    getSize( size ) {//b
        if ( size > 1000 ) {
            return ( size / unit ).toFixed( decimalNum ) + "KB";
        } else if ( size > 1000 * unit ) {
            return ( size / unit / unit ).toFixed( decimalNum ) + "MB";
        } else {
            return size + "B";
        }
    }

    getFormNode = ( node ) => {
        this.$form = node;
    }

    downloadFile = () => {
        let { src, file } = this.props;
        window.location.href = src + ( file ? '?download=' + encodeURI(_$escape(file.name)) : '' );
    }

    /**
     * 文件消息
     * 如果文件路径是图片，则转为图片消息
     * 如果文件类型（后缀）是可执行文件（ExeReg）则拦截此文件
    */
    render () {
        let { src="", ext="", file={}, name="" } = this.props;
        let imgReg = /png|jpg|bmp|jpeg|gif|webp/i,
            ExeReg = /exe|bat/i;
        if ( imgReg.test( src ) ) {
            return <ImageMsg src={src}/>
        }
        if ( ExeReg.test( ext ) ) {
            return <TextMsg text={"[非法文件，已被本站拦截]"}/>;
        }
        return (
            <div className={"msg-item file-msg"} onClick={this.downloadFile}>
                <div className="file-msg-name auto-omit">{file.name}</div>
                <div className="file-msg-size">{this.getSize(file.size)}</div>
            </div>
        )
    }
}

export default FileMsg;