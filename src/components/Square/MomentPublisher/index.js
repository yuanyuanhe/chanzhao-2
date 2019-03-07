import React, { Component,Fragment } from 'react';
import { connect } from 'react-redux';
import { getUserData } from "../../../util";
import {getClient, sendCreateSquareMomentRequest} from "../../../requests";
import { getPersonById, getUserUID } from "../../../redux/store/storeBridge";
import "./index.css"
import {
    ICON_RELEASE_IMG,
    ICON_RELEASE_TOPIC,
    ICON_RELEASE_FORWARDING,
    ICON_RELEASE_EYE,
    ICON_RELEASE_SEND,
} from '../../../configs/iconNames'
import Avatar from '../../generics/Avatar';
import ImageSelector from './ImageSelector';
import TopicSelector from './TopicSelector';
import TransportSelector from './TransportSelector';
import AccessSelector from './AccessSelector';
import {MODAL_CONFIRM} from "../../../configs/consts";
import {MITURE_TOPIC_ICON_CANCEL} from "../../../configs/iconNames";
import {IMAGE_FILE_TYPE_CHECK,TIP_MSG} from "../../../configs/TIP_TEXTS";

const HandlerKeys = {
    resource: "resource",
    topic: "topic",
    forwardable: "forwardable",
    publicable: "publicable",
    publish: "publish",
};

const mpPlaceholder = '说点什么吧...';
const defaultImage = 'web/assests/img/default-icon-min.png'.checkSrcHost();
class MomentPublisher extends Component {
    constructor( props ) {
        super( props );

        this.handlerMap = {
            [ HandlerKeys.resource ]: this.resourceHandler,
            [ HandlerKeys.topic ]: this.topicHandler,
            [ HandlerKeys.forwardable ]: this.forwardHandler,
            [ HandlerKeys.publicable ]: this.publicHandler,
            [ HandlerKeys.publish ]: this.publishHandler,
        };

        this.state = {
            words: "",
            showImageSelector: false,
            showTopicSelector: false,
            showTransoprtController: false,
            showAccessSelector: false,
            images: [],
            ifSupportFileReader: true,
            label: "",
            topic: "",
            topic_id: "",
            allowTransport: true,
            accessType: "1",
            accessTypes: {
                "1": "公开",
                "-1": "仅自己可见",
                "2": "选中可见",
                "-2": "选中不可见"
            },
            selectedLabels: {},
            // accessMembers: []
        }
    }

    /**
     * 检查浏览器是否支持file api
    */
     componentWillMount () {
        try {
            let reader = new FileReader();
        } catch ( e ) {
            this.setState( {
                ifSupportFileReader: false
            } );
        }
    }

    /**
     * 选择图片后，将图片转换为dataUrl添加到state中
     * 图片在点击发布按钮之后再上传
    */
    inputChangeHandler = ( ipt ) => {
        let { showModal } = this.props;
        let { ifSupportFileReader } = this.state;
        let images = this.state.images.slice(0);
        let that = this,
            dataUrl;
        let file = ipt.files[0];//获取input输入的图片
        let name = file.name;
        //file reader 的兼容性检测
        if ( ifSupportFileReader ) {
            let reader = new FileReader();
            if ( !/image\/\w+/.test( file.type ) ) {
                showModal( { text: IMAGE_FILE_TYPE_CHECK } );
                return false;
            }//判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
            reader.readAsDataURL( file );//转化成base64数据类型
            reader.onload = function () {
                dataUrl = this.result;
                images.push( {
                    dataUrl,
                    ipt,
                    index: Date.now()
                } );
                that.setState( {
                    images
                } );
            }
        } else {
            showModal( { text: TIP_MSG } );
            dataUrl = defaultImage;
            images.push( {
                dataUrl,
                ipt,
                index: Date.now()
            } );
            that.setState( {
                images
            } );
        }
    }

    /**
     * 向图片选择器添加图片
    */
    addImage = () => {
        let ipt = document.createElement('input');
        ipt.addEventListener('change', this.inputChangeHandler.bind(this, ipt), false);
        ipt.type = 'file';
        ipt.accept = 'image/*';
        ipt.click();
    }

    /**
     * 删除图片选择器中已经选择的图片
    */
    deleteImage = ( index ) => {
        let images = this.state.images.slice(0);
        for ( let i = images.length - 1; i >= 0; --i ) {
            if ( images[i].index === index ) {
                images.splice( i, 1 );
                this.setState( {
                    images
                } );
                return;
            }
        }
    }
    /**
     * 秘圈文本changeHandler
    */
    wordChangeHandler = ( e ) => {
        this.setState( {
            words: e.target.value
        } )
    }

    /**
     * 根据当前userUID获取用户信息
    */
    static getMyInfo() {
        return getUserData( getPersonById( getUserUID() ) );
    }

    /**
     * 底部组件基本数据
    */
    static getFooterData() {
        return [
            {
                key: HandlerKeys.publish,
                title: "",
                classes: ['mp-btn-right', 'mp-btn-send'],
                imageSrc: ICON_RELEASE_SEND,
            },
        ];
    }

    /**
     * 显示/隐藏图片选择器，同时隐藏其他选择器
    */
    resourceHandler = e => {
        this.setState( {
            showImageSelector: !this.state.showImageSelector,
            showTopicSelector: false,
            showTransoprtController: false,
            showAccessSelector: false,
        } );
        return 0
    };

    /**
     * 隐藏图片选择器
    */
    hideSelector = () => {
        this.setState( {
            showImageSelector: false
        } )
    }

    /**
     * 显示/隐藏话题选择器，同时隐藏其他选择器
    */
    topicHandler = e => {
        this.setState( {
            showImageSelector: false,
            showTransoprtController: false,
            showAccessSelector: false,
            showTopicSelector: !this.state.showTopicSelector,
        } )
    };

    /**
     * 清空话题选择器
    */
    cleanTopic = () => {
        this.setState( {
            topic: "",
            topic_id: "",
            label: "",
        } )
    }

    /**
     * 显示/隐藏秘圈转发权限选择器，同时隐藏其他选择器
    */
    transportHandler = e => {
        this.setState( {
            showImageSelector: false,
            showTransoprtController: !this.state.showTransoprtController,
            showTopicSelector: false,
            showAccessSelector: false,
        } )
    };

    /**
     * 转发权限按钮点击处理
    */
    toggleTransportAllow = () => {
        this.transportAccessCheck( !this.state.allowTransport, () => {
            this.setState( {
                allowTransport: !this.state.allowTransport
            } );
        } );
    }

    /**
     * 显示/隐藏秘圈权限选择器，同时隐藏其他选择器
    */
    publicHandler = e => {
        this.setState( {
            showImageSelector: false,
            showTransoprtController: false,
            showTopicSelector: false,
            showAccessSelector: !this.state.showAccessSelector,
        } )
    };

    /**
     * 显示秘圈权限选择器
    */
    showAccessSelector = () => {
        this.setState( {
            showAccessSelector: true
        } )
    }

    /**
     * 切换选择的秘圈可见性权限
    */
    selectAccess = ( newAccess ) => {
        let { accessType } = this.state;
        if ( newAccess === accessType ) {
            return;
        }
        let newState = {
            accessType: newAccess
        };
        if ( newAccess === '1' || newAccess === "-1" ) {
            newState.selectedLabels = {};
        }
        this.setState( newState );
    }

    /**
     * 切换转发权限时检查秘圈可见权限
     * 如果要开启转发权限，秘圈必须是公开的
    */
    transportAccessCheck( accessWillChoose, submitHandler ) {//转发权限和秘圈可见权限的制约检测
        if ( !!accessWillChoose && this.state.accessType !== '1' ) {
            let { showModal } = this.props;
            showModal( { type: MODAL_CONFIRM, text: "开启转发权限将会强制秘圈公开，确认开启转发权限吗？", callback: () => {
                this.setState( {
                    accessType: "1",
                    selectedLabels: {}
                } );
                !!submitHandler && submitHandler();
            } } )
        } else {
            !!submitHandler && submitHandler();
        }
    }

    /**
     * 切换秘圈可见权限的时候检查转发权限
     * 非公开权限（仅自己可见，部分人可见，部分人不可见）必须不允许转发
    */
    accessCheck = ( accessWillCheck, submitHandler, cancelHandler ) => {//转发权限和秘圈可见权限的制约检测
        let { showModal } = this.props;
        let { accessType, allowTransport } = this.state;
        if ( accessWillCheck !== "1" && !!allowTransport ) {//选择非公开权限必须不允许转发
            showModal( { type: MODAL_CONFIRM, text: "选择非公开权限将关闭转发权限，确认选择非公开权限吗？", callback: () => {
                this.setState( {
                    allowTransport: false
                } );
                !!submitHandler && submitHandler();
            } } )
        } else {
            !!submitHandler && submitHandler();
        }
    }

    /**
     * 选择秘圈权限中的分组，已存在的删除，不存在的添加
    */
    selectLabel = ( name, members ) => {
        let labelCache = Object.assign( {}, this.state.selectedLabels );
        if ( !!labelCache[ name ] ) {
            delete labelCache[ name ];
        } else {
            labelCache[ name ] = members;
        }
        this.setState( {
            selectedLabels: labelCache
        } );
    }

    /**
     * 先期验证无异常后发送添加秘圈请求到服务器
    */
    publishMoment = ( params ) => {
        let { refreshMoments } = this.props;
        sendCreateSquareMomentRequest( params ).then( ( { msgId, message } ) => {
            if ( msgId === '200' ) {
                this.cleanPublisher();
                setTimeout( () => { !!refreshMoments && refreshMoments(); } , 500 );
            } else {
                console.log( 'publish error :', msgId, message )
            }
        })
    }

    /**
     * 上传用户选择的图片到oss
    */
    async uploadImages ( momentParam ) {
        let { images } = this.state;
        let { showModal } = this.props;
        let len = images.length;
        let res;
        try {
            res = await getClient();
        } catch ( e ) {
            showModal( { text: "请求失败！" } );
            console.log( e );
            return false;
        }
        if ( !res ) {
            showModal( { text: "上传失败!" } );
            return false;
        }
        let { client, path } = res;
        let pathCache = [],
            photoUploadedCount = 0;
        for( let i = 0; i < len; i++){
            let file = images[ i ].ipt.files[ 0 ];
            let name = file.name,
                mixin = parseInt( Math.random() * 100000000 ) + "",
                suffix = name.substr(name.lastIndexOf(".")),//获取 .jpg 这样的后缀
                fileName = name.substr(0, name.lastIndexOf("."));//获取后缀前的文件名
            let time = Date.now();
            const storeAs = "images/" + path + "/" + window.MD5( fileName + mixin + time ) + suffix;
            pathCache[ i ] = storeAs;
            var that = this;
            client.multipartUpload( storeAs, file ).then( ( result ) => {
                let url,
                    pLen = pathCache.length;
                if ( !!result.url ) {
                    url = result.url;
                } else {
                    url = result.name.checkSrcHost();
                }
                //为了保证图片顺序一致
                for ( let i = 0; i < pLen; i++ ) {
                    if ( ~url.indexOf( pathCache[ i ] ) ) {//找到匹配
                        pathCache[ i ] = url;
                        break;
                    }
                }
                if ( ++photoUploadedCount === len ) {
                    momentParam.res_json = JSON.stringify( pathCache );
                    this.publishMoment( momentParam );
                }
            } ).catch( function ( e ) {
                console.error( e );
                showModal( { text: "上传失败!" } );
                return false;
            });
        }
    }

    /**
     * 发布按钮点击处理
    */
    publishHandler = async e => {
        let { words, images, label, topic_id, allowTransport, accessType, selectedLabels } = this.state;
        let { showModal } = this.props;
        let len = images.length;
        let accessMembers = [];
        for( let key in selectedLabels ) {
            accessMembers.push( ...selectedLabels[key] );
        }
        accessMembers = Array.from( new Set( accessMembers ) );
        let momentParam = {
            words,
            shield_type: parseInt( accessType ),
            shield_array: accessMembers,
            allow_repost: allowTransport ? 1 : 0,
        };
        if ( !!topic_id ) {
            momentParam.topic_id = parseInt( topic_id );
        }
        if ( !!label ) {
            momentParam.labels = [ label ];
        }
        if ( len === 0 ) {
            this.publishMoment( momentParam );
        } else {
            momentParam.type = 2;
            this.uploadImages( momentParam )
        }
    };

    /**
     * 清空发布组件所有状态，用于发布秘圈后初始化组件
    */
    cleanPublisher = () => {
        this.setState( {
            words: "",
            images: [],
            showImageSelector: false,
            topic_id: "",
            topic: "",
            label: "",
            showTopicSelector: false,
            allowTransport: true,
            showTransoprtController: false,
            showAccessSelector: false,
            accessMembers: [],
            accessType: "1"
        } );
    }

    /**
     * 隐藏话题选择器
    */
    hideTopicSelector = () => {
        this.setState( {
            showTopicSelector: false
        } )
    }

    /**
     * 切换选择的话题
    */
    selectTopic = ( topic, topic_id ) => {
        if ( this.state.topic_id === topic_id ) {
            return this.setState( {
                topic: "",
                topic_id: "",
                label: ""
            } );
        }
        this.setState( {
            topic,
            topic_id
        } );
    }

    /**
     * 秘圈标签文本changeHandler
     * 必须先选择话题才能编辑，取消选择话题的时候清空标签
    */
    changeLabel = ( label ) => {
        if ( this.tipping ) {
            return;
        }
        let { topic } = this.state;
        if ( !topic ) {
            this.tipping = true;
            this.props.showModal( { text: "请先选择话题！", callback: () => { this.tipping = false; } } );
            return;
        }
        if ( label.length > 16 ) {
            this.tipping = true;
            this.props.showModal( { text: "标签最多可以输入16个字符！", callback: () => { this.tipping = false; } } );
            return;
        }
        this.setState( {
            label
        } );
    }

    /**
     * 秘圈发布组件,广场首页发布部分
     * state::
     *     words: {String} 要发布的秘圈文本
     *     showImageSelector: {Boolean} 图片选择器显示开关
     *     images: {Array} 保存js file api读取的本地图片的dataURL
     *     label: {String} 用户填写的标签文本
     *     topic: {String} 用户选择的话题文本
     *     showTopicSelector: {Boolean} 话题选择器显示开关
     *     allowTransport: {Boolean} 转发选择器中用户选择的是否开放转发权限
     *     showTransoprtController： {Boolean} 转发权限选择器显示开关
     *     accessType： {String} 秘圈权限类型，公开，隐私，部分人可看等
     *     showAccessSelector： {Boolean} 权限选择器显示开关
     *     selectedLabels: {Array} 已经被选中的分组;这个labels指秘圈权限中的分组;
    */
    render() {
        const { avatar, name } = this.constructor.getMyInfo();
        let { words, showImageSelector, images, label, topic, showTopicSelector, allowTransport, showTransoprtController, accessType, accessTypes,showAccessSelector, selectedLabels } = this.state;
        let { showModal } = this.props;
        return (
            <div className="moment-publisher shadow">
                <textarea value={ words } onChange={this.wordChangeHandler} placeholder={mpPlaceholder} className="moment-editor" name="moment" id="moment-textarea" cols="120" rows="10">
                </textarea>
                <Avatar classes={['mp-avatar']} src={avatar} title={name} alt={name} />
                { <div className={ "moment-publisher-topic-area " + ( !!topic ? "": "blank" ) }>
                    {
                        !!topic ? <Fragment>
                            <span className="mpta-topic">{topic}</span>
                            <span className="mpta-label auto-omit">{ label ? `#${label}#` : false }</span>
                            <img onClick={this.cleanTopic} src={MITURE_TOPIC_ICON_CANCEL.convertIconSrc()} alt="取消" title="取消" className="vertical-middle mpta-cancel" />
                        </Fragment> : false
                    }
                </div> }
                <div className="moment-publisher-footer clear">
                    {/* 图片 */}
                    <button className={ "mpf-btn mp-btn-left " + ( showImageSelector ? "mp-btn-selected" : "" ) } onClick={this.resourceHandler}>
                        <img src={ICON_RELEASE_IMG.convertIconSrc()} alt="" title="图片" />
                        <span>图片</span>
                    </button>
                    <ImageSelector images={images} deleteImage={this.deleteImage} addImage={this.addImage} showModal={showModal} show={showImageSelector} hideSelector={this.hideSelector}/>
                    {/* 话题 */}
                    <button className={ "mpf-btn mp-btn-left " + ( showTopicSelector ? "mp-btn-selected" : "" ) } onClick={this.topicHandler}>
                        <img src={ICON_RELEASE_TOPIC.convertIconSrc()} alt="" title="话题" />
                        <span>话题</span>
                    </button>
                    <TopicSelector curTopic={topic} selectTopic={this.selectTopic} label={label} changeLabel={this.changeLabel} showModal={showModal} show={showTopicSelector} hideSelector={this.hideTopicSelector} />
                    {
                        this.constructor.getFooterData().map(item => {
                            return (
                                <button className={'mpf-btn ' + ( item.classes.join( ' ' ) )} key={item.key} onClick={this.handlerMap[ item.key ]}>
                                    <img src={item.imageSrc.convertIconSrc()} alt={item.key} />
                                    <span>{item.title}</span>
                                </button>
                            );
                        })
                    }
                    {/* 权限 */}
                    <button className="mpf-btn mp-btn-right" onClick={this.publicHandler}>
                        <img src={ICON_RELEASE_EYE.convertIconSrc()} alt="" title={"转发"} />
                        <span style={ { width: "70px" } } >{ accessTypes[ accessType ] }</span>
                    </button>
                    <AccessSelector showSelector={this.showAccessSelector} showModal={showModal} access={ accessType } show={showAccessSelector} selectAccess={this.selectAccess} accessCheck={this.accessCheck} selectLabel={this.selectLabel} selectedLabels={selectedLabels} />
                    {/* 转发 */}
                    <button className="mpf-btn mp-btn-right" onClick={this.transportHandler}>
                        <img src={ICON_RELEASE_FORWARDING.convertIconSrc()} alt="" title={"转发"} />
                        <span style={ { width:"70px" } }>{ ( !allowTransport ? "不" : "" ) + "允许转发" }</span>
                    </button>
                    <TransportSelector allow={allowTransport} show={showTransoprtController} toggleAllow={this.toggleTransportAllow}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ( state ) => ({
    personlist: state.personlist
});

export default connect(
    mapStateToProps,
)( MomentPublisher );
