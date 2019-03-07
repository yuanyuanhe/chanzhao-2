import {requestWithToken} from "./index";
import { getTeamOwner, getUrl } from "../redux/store/storeBridge";
import { urls } from "../configs/localConfig";

export function sendLeaveTeamRequest(tid ) {
    return requestWithToken( {
        url: getUrl( "leaveTeam", { tid } ),
        type: "delete"
    } )
}

export function sendDismissTeamRequest( tid ) {
    return requestWithToken( {
        url: getUrl( "dismissTeam", { tid } ),
        type: "delete"
    } )
}

export function sendCreateTeamRequest( { name = "", accounts=[] } ) {
    return requestWithToken( {
        url: getUrl( "createTeam" ),
        type: "post",
        contentType: 'application/json',
        data: {
            manage_agree: 0,
            join_mode: 0,
            invite_users: accounts,
            name,
            msg: " "
        }
    } )
}

export function sendAddTeamMemberRequest( { teamId: tid, members = [], owner } ) {
    return requestWithToken( {
        url: getUrl( "addTeamMember", { tid } ),
        type: "post",
        contentType: 'application/json',
        data: {
            owner: parseInt( owner ),
            members,
            msg: " "
        }
    } )
}

/**
 * 踢出群成员
 * @param {string} tid - 群 id
 * @param {string[]} members - 踢出成员 uid, 不超过 10 个, 目前服务端仅支持一个切不能为自己和群主
 */
export function sendKickTeamMemberRequest( { tid, members } ) {
    const owner = getTeamOwner();
    return requestWithToken( {
        url: urls.kickTeamMember( { tid } ),
        type: "delete",
        contentType: 'application/json',
        data: {
            owner,
            members
        }
    } );
}

/**
 * 获取自己所有的群信息
 * @return {{teams: {tid: string, name: string, max_number: number, owner: number, size: number}[]}}
 */
export function sendGetAllTeamsRequest() {
    return requestWithToken( {
        url: urls.getAllTeams(),
        type: 'get'
    } );
}

/**
 * 修改群信息
 * @param {object} teamInfo - 群信息
 * @param {string} teamInfo.teamId
 * @param {string} [teamInfo.name] - 群昵称最长 64 字符
 * @param {string} [teamInfo.intro] - 群介绍最长 512 字符
 * @param {string} [teamInfo.icon] - 群图片, 为绝对路径或者 oss 相对路径
 */
export function sendUpdateTeamInfoRequest( teamInfo ) {
    const teamId = teamInfo.teamId,
        owner = getTeamOwner( teamId );
    return requestWithToken( {
        url: urls.updateTeamInfo( { tid: teamId } ),
        type: 'put',
        contentType: 'application/json',
        data: {
            owner,
            ...teamInfo
        }
    } )
}

/**
 * 修改自己在群中的备注
 * @param {string} tid
 * @param {string} nickName
 */
export function sendUpdateMemberAliasRequest( { tid, nickName } ) {
    const owner = getTeamOwner( tid );
    return requestWithToken( {
        url: urls.updateMemberAlias( { tid } ),
        type: 'put',
        contentType: 'application/json',
        data: {
            owner,
            team_nick: nickName
        }
    } )
}

/**
 * 设置群消息免打扰
 * @param tid
 * @param {boolean} ope - 消息通知类型, 1: 全部不接受; 2: 全部接受;
 * @return {*}
 */
export function sendToggleTeamMuteRequest( { tid, isMute } ) {
    let ope = isMute ? 1 : 2;
    return requestWithToken({
        url: urls.toggleTeamMute( { tid } ),
        type: 'put',
        contentType: 'application/json',
        data: { ope }
    })

}
