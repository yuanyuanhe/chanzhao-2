import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import NavNotItem from './NavNotItem';
import ScrollContainer from '../../../generics/ScrollContainer';
import MenuHeader from '../../../generics/MenuHeader';
import {cleanSysNotification} from "../../../../redux/actions";
class NavNotification extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            showData: false,
            showDot: true
        }
    }

    /**
     * 通知icon点击处理： 显示/隐藏通知列表
    */
    toggleList = () => {
        if ( !this.state.showData ) {
            console.log( this.state )
            this.setState( {
                showDot: false
            } )
        }
        this.setState( {
            showData: !this.state.showData
        } );
        // delete notifications
        // if ( !this.state.showData ) {
        //     this.props.cleanSysNotification();
        // }
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.sysNotification.length > this.props.sysNotification.length ) {
            this.setState( {
                showDot: true
            } );
        }
    }

    /**
     * 隐藏系统通知列表
    */
    hideList = () => {
        this.setState( {
            showData: false
        } );
    }

    /**
     * 导航条通知组件
     * sysNotifications: {Array} 系统通知
    */
    render () {
        let { sysNotification } = this.props;
        let { showData, showDot } = this.state;
        return (
            <div className={'vertical-middle nav-notification-container'}>
                <div className={"nnc-icon" + ( showData || sysNotification.length > 0 ? " active": "" ) + ( sysNotification.length > 0 && showDot ? " show-dot" : "" ) } onClick={this.toggleList}>
                    <div className="nnc-icon-dot"></div>
                </div>
                <div className={ "nnc-list shadow clear" + ( showData ? " show" : "" ) }>
                    <MenuHeader closeHandler={this.toggleList} text={"通知"}/>
                    <div className="nav-scroll">
                        <ScrollContainer>
                            { sysNotification.length > 0 ? ( sysNotification.map( ( v, i ) => <NavNotItem key={i} data={v}/> ) ) :
                                <div className="nnc-empty-item">暂无消息</div>
                            }
                        </ScrollContainer>
                    </div>

                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        sysNotification: state.sysNotification
    }
}

function mapDispathToProsp( dispatch ) {
    return {
        cleanSysNotification: () => dispatch( cleanSysNotification() )
    }
}

// export default withRouter( connect(
//     mapStateToProps,
//     mapDispathToProsp
// )( Example ) );
export default connect(
    mapStateToProps,
    mapDispathToProsp
)( NavNotification );
