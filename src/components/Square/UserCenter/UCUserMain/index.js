import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import "./index.css";
import UCSearch from './UCSearch';
import UCEmptyPage from './UCEmptyPage';
import UCUserItem from './UCUserItem';
import UCPageController from './UCPageController';
import {getFriends, getMtsdk, getPersonById, getUserUID} from "../../../../redux/store/storeBridge";
import {getFans, getFocusedUsers, sendGetFocusUserAndFollowerNumRequest} from "../../../../requests";
import {setFocusedUsers, updatePersonList} from "../../../../redux/actions";
import {getPageNum, getUserData} from "../../../../util";
import {store} from "../../../../redux/store";
import SegmentedBar from '../../../generics/SegmentedBar';
import {checkUsersData} from "../../../../util/user";
import { userType } from '../../../../configs/consts';

class UCUserMain extends Component{
    constructor( props ) {
        super( props );
        let { account, type } = this.props.match.params,
            userUID = getUserUID();
        this.state = {
            account,
            navBarCur: type,
            page: 1,
            searchText: "",
            pageNums: {
              [userType.focus]: 1,
              [userType.follower]: 1
            }
        }
        this.state.navBars = [
            {
                key: userType.focus,
                text: "关注",
                users: {
                    //page: users; page start from 1
                    1: []
                }
            }, {
                key: userType.follower,
                text: "粉丝",
                users: {
                    1: []
                }
            }
        ];
        this.numEvPage = 10;
        this.funcMap = {
            [userType.focus]: getFocusedUsers,
            [userType.follower]: getFans,
            [userType.friend]: this.getFriendsByPage.bind( this )
        }
        this.changeUserType = this.changeUserType.bind( this );
        this.changePage = this.changePage.bind( this );
    }

    componentDidMount(  ) {
        let { match: { params: { account } } } = this.props;
        this.resetNavBar( account );
    }

    resetNavBar( account ) {
        let userUID = getUserUID();
        let newNavBars = this.state.navBars.slice( 0, 2 );
        if ( account == userUID ) {
            newNavBars.push( {
                key: userType.friend,
                text: "好友",
                users: {
                    1: []
                }
            } );
            this.setState( {
                navBarCur: "focus",
                pageNums: {
                    ...this.state.pageNums,
                    [ userType.friend ]: 1
                },
                navBars: newNavBars
            } )
        } else {
            this.setState( {
                navBarCur: "focus",
                navBars: newNavBars
            } );
        }
    }

    componentWillMount() {
        let { account, type } = this.props.match.params,
            userUID = getUserUID();
        this.refreshUsers( { key: type } );
        // this.setPageNum( account, userUID );
    }

    componentWillReceiveProps( nextProps ) {
        let { match: { params: { account: preAccount } } } = this.props;
        let { match: { params: { account: curAccount, type } } } = nextProps;
        if ( preAccount !== curAccount ) {
            this.refreshUsers( { key: type, account: curAccount } );
        }
    }

    get firstPage () {
        return 1
    }

    changePage( newPage ) {
        if ( this.changingPage ) {
            return;
        }
        this.changingPage = true;
        if ( newPage === 0 ) {
            return;
        }
        let { page, pageNums } = this.state;
        let { account, type } = this.props.match.params;
        if ( newPage > pageNums[type] || newPage === page ) {
            this.changingPage = false;
            return;
        }

        this.getUsersByPage( type, newPage ).then( () => {
            this.setState( {
                page: newPage
            } );
        } ).finally( () => {
            this.changingPage = false;
        } );
    }

    setPageNum( account, userUID ) {
        sendGetFocusUserAndFollowerNumRequest( account ).then( res => {
            if ( !res ) {
                return;
            }
            let pageNums = {
                [userType.focus]: getPageNum( res.focusUser, this.numEvPage ),
                [userType.follower]: getPageNum( res.follower, this.numEvPage )
            };
            if ( account == userUID ) {
                pageNums[ userType.friend ] = getPageNum( getFriends().length, this.numEvPage )
            }
            this.setState( {
                pageNums
            } );
        } )
    }

    //按页获取好友
    getFriendsByPage ( account, page ) {
        return new Promise( resolve => {
            let friends = getFriends(),
                numEvPage = this.numEvPage;
            let users = friends.slice( ( page - 1 ) * numEvPage, page * numEvPage ),
                accounts = [];
            checkUsersData( users ).finally( () => {
                resolve( { users } );
            } );
        } )
    }

    refreshUsers = ( { key, pageToRefresh, account } ) => {
        if ( this.loadingUsers ) {
            !!this.cancelRequest && this.cancelRequest();
            this.loadingUsers = false;
        }
        this.loadingUsers = true;
        this.setState( {
            page: pageToRefresh || this.firstPage
        } );
        let { page } = this.state;
        account = account || this.props.match.params.account;
        this.resetNavBar( account );
        let request = this.funcMap[ key ]( account, page );
        if ( key !== userType.friend ) {
            request = request.request;
            this.cancelRequest = request.cancelRequest;
        }
        request.then( res => {
            this.loadingUsers = false;
            this.setUsersByPage( key, page, res.users );
            this.setPageNum( account, getUserUID() )
        } );
    }

    getUsersByPage( type, page ) {
        if ( this.loadingUsers ) {
            !!this.cancelRequest && this.cancelRequest();
            this.loadingUsers = false;
        }
        this.loadingUsers = true;
        let { match: { params: { account } } } = this.props;
        let request = this.funcMap[ type ]( account, page );
        if ( type !== userType.friend ) {
            request = request.request;
            this.cancelRequest = request.cancelRequest;
        }
        return request.then( res => {
            this.loadingUsers = false;
            this.setUsersByPage( type, page, res.users );
        } );
    }

    setUsersByPage ( type, page, users ) {
        let navBars = this.state.navBars;
        navBars.find( v => {
            return v.key === type
        } ).users[ page ] = users;
        this.setState( {
            navBars,
            navBarCur: type,
            page: 1
        } );
    }

    changeUserType( type ) {
        if ( type === this.state.navBarCur ) {
            return
        }
        let { match: { params: { account } } } = this.props;
        this.props.history.replace( `/square/userCenter/${account}/users/${type}` );
        this.refreshUsers( { key: type } );
    }

    //get users that splited by page
    getUsers ( type ) {
        let users = this.state.navBars.find( v => {
            return v.key === type;
        } ).users;
        if ( type !== userType.friend ) {
            return users;
        }
        let res = {};
        for( let key in users ) {
            res[ key ] = [];
            users[key].forEach( v => {
                let { alias: name, autograph, avatar  } = getUserData( getPersonById( v.account ) );
                res[ key ].push( {
                    uid: v.account,
                    name,
                    autograph,
                    avatar
                } );
            } );
        }
        return res;
    }

    searchTextChangeHandler = ( text ) => {
        this.setState( {
            searchText: text
        } );
    }

    render () {
        let { match: { params: { account } } } = this.props;
        let { page, searchText, navBarCur, pageNums } = this.state,
            numEvPage = this.numEvPage,
            users = this.getUsers( navBarCur ),
            userRange = users[ page ] || [],
            userNum = userRange.length;
        let num = 0;
        let { showModal } = this.props;
        return (
            <div className="uc-user-main clear">
                <SegmentedBar items={this.state.navBars} cur={navBarCur} onCurChange={this.changeUserType} />
                <div className="uc-userlist-container clear shadow">
                    {/*<UCSearch text={searchText} changeHandler={this.searchTextChangeHandler} />*/}
                    { userNum === 0 ? <UCEmptyPage type={navBarCur}/> :
                        <Fragment>
                            <div className="user-userlist clear">
                                {userRange.map( ( v, i ) => (<UCUserItem refreshUsers={this.refreshUsers} page={page} showModal={showModal} type={navBarCur} num={userNum} index={i} key={i} data={v} />))}
                            </div>
                            <div className="uc-pagecontroller">
                                <UCPageController curPage={page} onChangePage={this.changePage} cur={navBarCur}
                                                  pageNum={pageNums[navBarCur]} />
                            </div>
                        </Fragment>
                    }

                </div>
            </div>
        );
    }
}

function mapStateToProps( state ) {
    return {

    }
}

function mapDispathToProsp( props ) {
    return {

    }
}

export default withRouter( connect(
    mapStateToProps,
    mapDispathToProsp
)( UCUserMain ) );
