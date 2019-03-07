import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
import Avatar from '../../../generics/Avatar';
import {getUserCenterRouter} from "../../../../util";
class MomentIdentityCard extends Component{
    constructor( props ) {
        super( props );
    }

    jumpToUserCenter = ( e ) => {
        let { data: { uid }, history } = this.props;
        history.push( getUserCenterRouter( uid ) );
    }

    render () {
        let { data: { avatar, mt_number, name, uid } } = this.props;
        return (
            <div className={"moment-item-indetityCard shadow"} onClick={this.jumpToUserCenter}>
                <div className="moment-item-idCard-main">
                    <Avatar src={avatar.convertSrcWebp()} classes={['moment-idCard-avatar']}/>
                    <div className="moment-idCard-message">
                        <div className="moment-idCard-name">
                            {name}
                        </div>
                        <div className="moment-idCard-mtNumber">
                            {mt_number}
                        </div>
                    </div>
                </div>
                <div className="moment-item-idCard-title">个人名片</div>
            </div>
        )
    }
}

export default withRouter( MomentIdentityCard );
