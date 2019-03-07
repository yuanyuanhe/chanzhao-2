import React, { Component, Fragment } from 'react';
import "./index.css";
import {sendAddLabelRequest, sendAddMemberRequest,sendDeleteMemberRequest, sendDeleteLabelRequest, sendGetAllLabelsRequest, sendUpdateLabelNameRequest} from "../../../../../requests";
import LabelItem from './LabelItem';
import FriendSelector from '../../../../generics/FriendSelector';
import SelectCircle from '../../../../generics/SelectCircle';
import {MSGIDS} from "../../../../../configs/consts";
import {CREATE_LABEL_ERROR, GET_LABEL_ERROR, NAME_IS_REQUIRED, REQUEST_ERROR, RETRY_LATER, UPDATE_LABEL_NAME_ERROR, UPDATE_MEMBER_ERROR} from "../../../../../configs/TIP_TEXTS";
class LabelSelector extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            labels: [],
            name: "",
            creatingLabel: false,//选择了新建标签
            label_creating: {
                name: "",
                members: []
            },
            selected: {//选择的标签
                name: "",
                members: []
            },//selected: { members, name }
            editing: {},
            showEdit: false
        }
    }

    componentWillMount() {
        this.refreshLabels();
    }

    /**
     * 刷新所有标签数据
    */
    refreshLabels() {
        let { showModal } = this.props;
        sendGetAllLabelsRequest().then( ( { msgId, labels } ) => {
            if ( msgId === MSGIDS.SUCCESS ) {
                this.setState( {
                    labels
                } );
                this.refreshSelected();
            } else {
                showModal( { text: GET_LABEL_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.error( e );
            showModal( { text: REQUEST_ERROR } );
        } );
    }

    /**
     * 选择分组中确定按钮点击回调
    */
    labelCheckSubmit = () => {
        let { showAccessSelector, hideSelector, chooseMembers } = this.props;
        !!hideSelector && hideSelector();
        !!showAccessSelector && showAccessSelector();
    }

    //点击新建标签开始新建
    startCreateLabel = () => {
        this.setState( {
            showEdit: true,
            label_creating: {
                name: "",
                members:[]
            },
            creatingLabel: true
        } )
    }

    //编辑标签
    editLabel = ( label ) => {
        let { chooseMembers } = this.props;
        // !!chooseMembers && chooseMembers( selected.members );
        this.setState( {
            editing: {
                name: label.name,
                members: label.members.slice( 0 )
            },
            creatingLabel: false,
            showEdit: true
        } );
    }

    //选择标签
    chooseLabel = ( selected ) => {
        let { selectLabel } = this.props;
        !!selectLabel && selectLabel( selected.name, selected.members.slice( 0 ) );
    }

    /**
     * 编辑标签确定按钮点击处理
     * 创建新标签会修改已存在标签的成员
     * 对比原成员和修改后的成员，增删对应成员
    */
    editSubmit = () => {
        let { selected, creatingLabel, labels, label_creating, editing } = this.state;
        let { showModal } = this.props;
        if ( creatingLabel ) {//新建标签
            if ( label_creating.name === "" ) {
                return showModal( { text: "请输入标签名称" } );
            }
            sendAddLabelRequest( label_creating.name, label_creating.members ).then( ( { msgId, message } ) => {
                if ( msgId === MSGIDS.SUCCESS ) {
                    // let { chooseMembers } = this.props;
                    // !!chooseMembers && chooseMembers( creatingLabel.members );
                    this.setState( {
                        showEdit: false,
                        creatingLabel: false,
                        selected: {
                            name: label_creating.name,
                            members: label_creating.members.slice(0)
                        },
                        label_creating: {
                            name: "",
                            members: []
                        }
                    } );
                    this.refreshLabels();
                } else {
                    showModal( { text: CREATE_LABEL_ERROR + RETRY_LATER } );
                    console.log( message )
                }
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } );
        } else {//更新成员
            let oldMembers = labels.find( v => v.name === editing.name ).members,
                newMembers = editing.members;
            let name = editing.name,
                members_delete = [],
                members_add = [];
            //如果标签里一个用户都没有，是否删除标签？还是只在发送前确定分组人数
            oldMembers.forEach( ( v, i ) => {
                if ( !~newMembers.indexOf( v ) ) {
                    members_delete.push( v );
                }
            } );
            newMembers.forEach( ( v, i ) => {
                if ( !~oldMembers.indexOf( v ) ) {
                    members_add.push( v );
                }
            } );
            if ( members_add.length === 0 && members_delete.length === 0 ) {
                return this.setState( {
                    showEdit: false
                } );
            }
            let promises = [];
            if ( members_delete.length > 0 ) {
                promises.push( sendDeleteMemberRequest( name, members_delete ) );
            }
            if ( members_add.length > 0 ) {
                promises.push( sendAddMemberRequest( name, members_add ) );
            }
            Promise.all( promises ).then( ( reses ) => {
                let item = reses.find( ( { msgId } ) => msgId !== MSGIDS.SUCCESS );
                if ( !!item ) {
                    return showModal( { text: UPDATE_MEMBER_ERROR + RETRY_LATER } );
                }
                this.refreshLabels();
                return this.setState( {
                    showEdit: false
                } );
            } ).catch( e => {
                showModal( { text: REQUEST_ERROR } );
            } );
        }
    }

    /**
     * 重置（清空）被选择的分组数据
    */
    refreshSelected = () => {
        let { selected, labels, label_creating } = this.state;
        let { chooseMembers } = this.props;
        let label = labels.find( v => v.name === selected.name ) || {};
        this.setState( {
            selected: {
                name: label.name || "",
                members: ( label.members || [] ).slice( 0 )
            }
        } );
        !!chooseMembers && chooseMembers( label.members || [] );
    }

    /**
     * 从分组编辑状态返回分组选择状态
    */
    hideEditer = () => {
        let { creatingLabel } = this.state;
        if ( creatingLabel ) {
            //在创建标签
        } else {
            //在编辑标签
            this.refreshSelected();
        }
        this.setState( {
            showEdit: false,
            creatingLabel: false,
            label_creating: {
                name: "",
                members: []
            }
        } )
    }

    /**
     * 选择分组成员到缓存，点击确认才会修改
    */
    addSelectedMember = ( account ) => {
        account = parseInt( account );
        let label,
            key;
        let { label_creating, creatingLabel, editing } = this.state;
        if ( creatingLabel ) {
            key = 'label_creating';
            label = Object.assign( {}, label_creating );
        } else {
            key = 'editing';
            label = Object.assign( {}, editing );
        }
        if ( !label.members ) {
            label.members = [];
        }
        let index = label.members.indexOf( account );
        if ( !~index ) {
            label.members.push( account );
        } else {
            label.members.splice( index, 1 );
        }
        this.setState( {
            [editing]: label
        } );
    }

    /**
     * 更新分组名称
    */
    nameUpdateHandler = ( e ) => {
        let newName = e.target.value,
            oldName = this.state.editing.name;
        let { creatingLabel, label_creating } = this.state;
        let { showModal } = this.props;
        if ( creatingLabel ) {
            return this.setState( {
                label_creating: {
                    name: newName,
                    members: label_creating.members.slice( 0 )
                }
            } );
        }
        if ( newName === oldName ) {
            return
        }
        if ( newName === "" ) {
            return showModal( { text: NAME_IS_REQUIRED } );
        }
        sendUpdateLabelNameRequest( oldName, newName ).then( ( { msgId, message } ) => {
            if ( msgId === '200' ) {
                this.setState( {
                    editing: {
                        ...this.state.editing,
                        name: newName
                    }
                } );
                this.refreshLabels();
            } else {
                console.log( msgId, message );
                showModal( { text: UPDATE_LABEL_NAME_ERROR + RETRY_LATER } );
            }
        } ).catch( e => {
            console.log( e );
            showModal( { text: REQUEST_ERROR } );
        } );
    }

    /**
     * 删除分组标签
    */
    deleteLabel = () => {
        let { editing } = this.state;
        let { showModal } = this.props;
        sendDeleteLabelRequest( editing.name ).then( ( { msgId, message } ) => {
            if ( msgId === '200' ) {
                this.setState( {
                    editing: {
                        name: "",
                        members: []
                    }
                } );
                this.refreshLabels();
            } else {
                showModal( { text: "删除失败，请稍候再试！" } );
                console.log( msgId, message )
            }
        } ).catch( e => {
            console.log( e )
            showModal( { text: "请求失败，请稍候再试！" } );
        } )
    }

    /**
     * 分组选择器，也包含包含新建、修改、删除分组标签
     * 复用了好友选择器组件用来新建和编辑分组
     * show: {Boolean} 分组选择器显示开关
     * selected: {Array} 已经被选中的分组
     * showEdit: {Boolean} 显示编辑分组modal开关
     * creatingLabel: {Boolean} 标志是否在创建新的分组
     * label_creating: {Object} 正在被新建的分组数据
     * editing： {Object} 正在被编辑的分组数据
    */
    render () {
        let { show } = this.props;
        if ( !show ) {
            return false;
        }
        let { labels, selected, showEdit, creatingLabel, label_creating, editing } = this.state;
        let { selectedLabels } = this.props;
        let selectedName, selectedMembers;
        if ( !!editing ) {
            selectedName = editing.name;
            selectedMembers = editing.members;
        }
        return (
            <Fragment>
                {/* select-area */}
                <div className={'label-selector-container clear shadow' + ( showEdit ? ' hide' : "" )}>
                    <div className="label-item create-label" id="create-label" onClick={this.startCreateLabel}>新建标签</div>
                    { labels.map( ( v, i ) => <LabelItem chooseLabel={this.chooseLabel} editLabel={this.editLabel} selected={selectedLabels} key={i} data={v} /> ) }
                    <button onClick={this.labelCheckSubmit} className="label-btn label-submit">确定</button>
                </div>
                {/* edit-area */}
                <div className={ "label-edit-container clear shadow" + ( showEdit ? ' show' : "" ) } >
                    <div className="label-list clear">
                        <div onClick={this.startCreateLabel} className={"label-list-item label-list-create-item" + ( creatingLabel ? " selected": "" )}>新建标签</div>
                        { labels.map( ( item, i ) => <div onClick={this.editLabel.bind( this, item ) } className={'label-list-item' + ( !creatingLabel && selectedName === item.name ? ' selected' : "" ) } key={i} >
                            <span className="label-list-item-name auto-omit">{ item.name }</span>
                            <SelectCircle selected={ !!selectedLabels[ item.name ] } />
                            {/*<span className="label-list-item-icon">&radic;</span>*/}
                        </div> ) }
                    </div>
                    <div className="label-edit-area clear">
                        <FriendSelector deleteHandler={this.deleteLabel} selected = { creatingLabel ? label_creating.members : selectedMembers } addToSelected={this.addSelectedMember} show={showEdit} classes={['label-friend-selector']} callback={this.editSubmit} cancelCallback={this.hideEditer} name={ creatingLabel ? label_creating.name : selectedName } creatingNew={creatingLabel} defaultText={'标签名称'} namePlaceholder={'请输入标签名称'} nameUpdateHandler={this.nameUpdateHandler} />
                    </div>
                    {/*<button onClick={this.editSubmit}>确定</button>*/}
                </div>
            </Fragment>
        )
    }
}

export default LabelSelector;
