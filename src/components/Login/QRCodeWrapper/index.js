import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import {b64EncodeUnicode} from "../../../util";
class QRCodeWrapper extends Component {
    constructor( props ) {
        super( props );
    }

    /**
     * 二维码扫码包装组件
    */
    render () {
        let { value } = this.props;
        return (
            <QRCode value={ value }/>
        )
    }
}

export default QRCodeWrapper;