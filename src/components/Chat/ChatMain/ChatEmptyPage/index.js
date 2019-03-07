import React, { Component } from 'react';
import "./index.css";
import { withRouter } from 'react-router-dom';
import { BLANK_NEWS, BLANK_GROUP, BLANK_FRIENDS } from '../../../../configs/iconNames';
class ChatEmptyPage extends Component{
    constructor( props ) {
        super( props );
        this.regs = {
            session: /session/gi,
            friend: /friend/gi,
            team: /team/gi,
        }
    }

    getSrcByPathname ( pathname ) {
        if ( this.regs.session.test( pathname ) ) {
            return BLANK_NEWS.convertIconSrc();
        } else if ( this.regs.friend.test( pathname ) ) {
            return BLANK_FRIENDS.convertIconSrc();
        } else if ( this.regs.team.test( pathname ) ) {
            return BLANK_GROUP.convertIconSrc();
        } else {
            return "";
        }
    }

    render () {
        let { location: { pathname } } = this.props;
        let iconSrc = this.getSrcByPathname( pathname );
        if ( !iconSrc ) {
            return false;
        }
        return (
            <div className={'chat-empty-page'}>
                <img className={'chat-empty-page-img'} src={iconSrc} alt="" title="" />
            </div>
        )
    }
}

export default withRouter( ChatEmptyPage );
