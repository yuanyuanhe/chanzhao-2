import React, { Component } from 'react';
import "./index.css";
import EditInput from './EditInput';
import { ICON_NEWS_EDIT } from '../../../../configs/iconNames';
const iconSrc = ICON_NEWS_EDIT.convertIconSrc();
class ProfileItem extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            startEdit: false
        }
        this.changeState = this.changeState.bind( this );
    }

    handler( blurHandler ) {
        return ( ( e ) => {
            this.setState( {
                startEdit: false
            } );
            blurHandler( e );
        } ).bind( this );
    }

    changeState() {
        this.setState( {
            startEdit: true
        } )
    }

    getNormal( value, clickHandler ) {
        if( !clickHandler ) {
            return <div className={ "profile-item-value" + ( !!clickHandler && " can-be-clicked" || "" ) } onClick={ !!clickHandler ? clickHandler: undefined }>{value}</div>;
        } else {
            //<MemberList show={this.state.showMembers}/>
            return <div className={ "profile-item-value" + ( !!clickHandler && " can-be-clicked" || "" ) } onClick={ !!clickHandler ? clickHandler: undefined }><span onClick={clickHandler}>{value}</span></div>;
        }
    }

    getEditState( blurHander, text ) {
        return <EditInput blurHandler={blurHander} text={text}/>
    }

    getWordClassName( text ) {
        switch( text.length ) {
            case 2:
                return "";
            case 3:
                return 'word-3';
            case 4:
                return 'word-4';
            default:
                return "words"
        }
    }

    /**
     * 详情部分 用户/群组资料item
     * 根据key长度（字数）的不同设置不同的letter-sapcing属性
     * 保证key的总宽度一致（左对齐）
    */
    render () {
        let main,
            startEdit = this.state.startEdit,
            { key, value, text, blurHandler, clickHandler } = this.props.data;
        if ( !key && !value ) {
            return false;
        }
        if ( !!blurHandler && startEdit ) {
            main = this.getEditState( this.handler( blurHandler ), value );
        } else {
            main = this.getNormal( value, clickHandler );
        }
        let wordsClassName = this.getWordClassName( text )
        return (
            <div className={"profile-item clear"}>
                <div className={ "profile-item-key " + wordsClassName}>{text}</div>
                { main }
                {/*{ !!blurHandler && !startEdit ?  <img onClick={this.changeState} className={"edit-icon"} src={iconSrc} alt="" title={ "编辑" } /> : false}*/}
            </div>
        )
    }
}

export default ProfileItem;
