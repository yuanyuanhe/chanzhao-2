import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import FriendGroup from './FriendGroup';
import SelectorItem from '../SelectorItem';
import ScrollContainer from '../ScrollContainer';
import SelectorSearch from '../SelectorSearch';
import SelectedItem from '../SelectedItem';
import {getFriendNameList, getNameGroups, getPinYin, getUserData} from "../../../util";
import {getPersonById} from "../../../redux/store/storeBridge";
import { FICON_RIEND_EDIT } from '../../../configs/iconNames';
import {P2P} from "../../../configs/consts";

class FriendSelector extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            nameBak: "",
            searchText: "",
            showNameIpt: false,
            startEdit: false,
            friendSearcherPlaceholder: "搜索好友"
        }
    }

    static getDerivedStateFromProps ( nextProp ) {
        if ( typeof nextProp.name !== 'undefined' ) {
            return {
                nameBak: nextProp.name
            }
        } else {
            return {
                nameBak: ""
            }
        }
    }

    nameChangeHandler = ( e ) => {
        this.setState( {
            nameBak: e.target.value
        } )
    }

    filterFriends() {
        let { filtered = [] } = this.props,
            res = [],
            friends = this.props.friends;
        if ( filtered.length === 0 ) {
            return friends;
        }
        friends.forEach( ( v ) => {
            if ( !~filtered.indexOf( v.account ) ) {
                res.push( v );
            }
        } )
        return res;
    }

    getSelectedDatas( selected ) {
        let selectedDatas = [];
        selected.forEach( account => {
            let { alias: name } = getUserData( getPersonById( account ) );
            selectedDatas.push( {
                account,
                name
            } );
        } );
        return selectedDatas;
    }

    changeState = () => {
        this.setState( {
            startEdit: true
        } )
    }

    nameBlurHandler = ( e ) => {
        let { nameUpdateHandler } = this.props;
        this.setState( {
            startEdit: false
        } );
        !!nameUpdateHandler && nameUpdateHandler(e);
    }

    getFriendGroup( group ) {
        let { selected = [], addToSelected } = this.props;
        return group.map( ( v, i ) => {
            if ( v.accounts.length === 0 ) {
                return false;
            }
            return <FriendGroup addToSelected={addToSelected} selected={selected} data={v} key={i}/>
        } )
    }

    addToselectedAndResetSearch = ( account ) => {
        let { addToSelected } = this.props;
        !!addToSelected && addToSelected( account );
        this.resetSearchText();
    }

    getSearchResult( words ) {
        //search from friends
        let searchKey = getPinYin( words ).toLowerCase(),
            { friends, selected = [] } = this.props,
            accounts = [];
        friends.forEach( ({ account }) => {
            let { alias, name } = getUserData( getPersonById( account ) );
            if ( ~getPinYin( alias ).toLowerCase().indexOf( searchKey ) || ~getPinYin( name ).toLowerCase().indexOf( searchKey ) ) {
                accounts.push( account );
            }
        } );
        return accounts.map( ( v, i ) => {
            return (<SelectorItem selected={selected} addToSelected={this.addToselectedAndResetSearch} account={v} key={i} type={P2P} />)
        } )
    }

    changeSearchText = ( newText ) => {
        this.setState( {
            searchText: newText
        } );

    }

    resetSearchText = () => {
        this.setState( {
            searchText: ""
        } )
    }

    getNameEditer () {
        let { name, namePlaceholder, creatingNew, defaultText } = this.props;
        let { nameBak, startEdit, searchText } = this.state;
        return <div className="fsne-container">
            { startEdit ? false : <span className="fsne-text">{ creatingNew && !name ? defaultText : name}</span> }
            { !startEdit ?  <img onClick={this.changeState} className={"edit-icon"} src={FICON_RIEND_EDIT.convertIconSrc()} alt="" title={ "编辑" } /> : false}
            { startEdit ? <input type="text" className={'friend-selector-name-editer'} placeholder={namePlaceholder} value={nameBak} onChange={this.nameChangeHandler} onBlur={this.nameBlurHandler} /> : false }
        </div>
    }

    /**
     * selected: {Array} 已选中帐号数组
     * addToSelected: {Function} 帐号点击处理方法，包括添加新帐号和将已选中帐号删除，不只是添加;同时也作为右边昵称组件里叉的点击处理
     * show: {Boolean} 是否显示好有选择其
     * classes: {Array} 引用组件自定义选择器的类的数组
     * callback： {Function} 选择器确定按钮的点击处理方法
     * name: {String} 创建label时右边那块左上角显示的label名称（可以拓展为通用的组名）
     * deleteHandler: {Function} 删除群组的按钮的点击回调，用于删除群组
     * cancelCallback: {Function} 如果有则显示取消按钮，作为取消按钮的点击处理方法，没有（undefined）则不显示取消按钮
     * creatingNew：{Boolean} 判断是编辑还是新建，如果是新建则不显示删除群组的icon
    */
    render () {
        let { selected = [], addToSelected, show, classes, callback, name, deleteHandler, cancelCallback, creatingNew } = this.props;
        if ( !show ) {
            return false;
        }
        let { searchText, friendSearcherPlaceholder } = this.state;
        let showNameEdit = typeof name !== 'undefined';
        classes = classes.join( ' ' );
        let friends = this.filterFriends();
        let friendNodeList;
        if ( !!searchText ) {
            friendNodeList = this.getSearchResult( searchText );
        } else {
            let group = getNameGroups( getFriendNameList( friends ));
            friendNodeList = this.getFriendGroup( group );
        }

        let selectedDatas = this.getSelectedDatas( selected );

        return (
            <div className={'friend-selector-container clear shadow ' + classes}>
                <div className="friend-selector-select-area">
                    <SelectorSearch placeholder={friendSearcherPlaceholder} text={searchText} changeText={this.changeSearchText}/>
                    <div className="friend-selector-scroll-area">
                        <ScrollContainer>
                            { friendNodeList }
                        </ScrollContainer>
                    </div>

                </div>
                <div className="selected-area">
                    <div className="selected-area-title">{ showNameEdit ? this.getNameEditer() : "已选择" }{ !creatingNew && typeof deleteHandler !== 'undefined' ? <span className={'selected-area-icon-delete'} onClick={deleteHandler}></span> : false }</div>

                    <div className="selected-item-container">
                        <ScrollContainer>
                            { selectedDatas.map( ( { name, account },i ) => <SelectedItem key={i} account={account} name={name} deleteHandler={addToSelected}  /> ) }
                        </ScrollContainer>
                    </div>

                    <button className={'selector-btn selector-submit'} onClick={callback}>确认</button>
                    { !cancelCallback ? false : <button className={'selector-btn selector-cancel'} onClick={cancelCallback}>取消</button> }
                </div>
            </div>
        )
    }
}

function mapStateToProps( state ) {
    return {
        friends: state.friendlist
    }
}

function mapDispathToProsp( dispatch ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( FriendSelector ) );
