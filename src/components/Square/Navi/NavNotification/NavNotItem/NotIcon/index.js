import React, { Component } from 'react';
class NotIcon extends Component{
    constructor( props ) {
        super( props );
    }

    render () {
        let { iconSrc } = this.props;
        return (
            <div className="nav-notice-item-left vertical-middle">
                <img className={'nav-notice-icon vertical-middle'} src={iconSrc} alt="" title="" />
            </div>
        )
    }
}

export default NotIcon;
