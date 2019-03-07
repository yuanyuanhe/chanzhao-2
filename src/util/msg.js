import {getPersonById, getTeamById, getTeamMembers, getUserUID} from "../redux/store/storeBridge";
import {getUserData} from "./index";

export function getMemberNick( teamId, account ) {
    let teamData = getTeamMembers( teamId );
    if ( !teamData ) {
        return ""
    }
    let members = teamData.members,
        mlen = members.length;
    for ( let i = 0; i < mlen; ++i ) {
        if ( +members[ i ].account === +account ) {
            return members[ i ].nickInTeam;
        }
    }
    return "";
}

export function transNotification(item) {
    let Netcall = window.Netcall,
        userUID = getUserUID();
    let type = item.attach.type,
        from = ( item.from === userUID ? true : false ),
        str,
        tName,
        accounts,
        member = [];

    //从消息item拿得到team信息就从那边拿,msg那拿不到就本地拿
    //这冗余代码就是为了处理群通知的文案高级群叫群，讨论组叫讨论组
    let team = item.attach && item.attach.team;
    if ( !team ) {
        team = getTeamById( item.target );
    } else {
        if ( !team.type ) {
            team = getTeamById(item.target);
        }
    }
    if ( team && team.type && team.type === "normal" ) {
        tName = "讨论组";
    } else if ( team ) {
        tName = "群";
    } else { // 既不是群，也不是讨论组， p2p 音视频通话相关消息
        let netcallType = item.attach.netcallType;
        let netcallTypeText = netcallType === Netcall.NETCALL_TYPE_VIDEO ? '视频' : '音频';
        switch ( type ) {
            case 'netcallMiss':
                return '未接听';
            case 'netcallBill':
                return "通话" + (item.flow === "in" ? "接听" : "拨打") + "时长 " + getNetcallDurationText(item.attach.duration);
            case 'cancelNetcallBeforeAccept':
                return '无人接听';
            case 'rejectNetcall':
                return '已拒绝';
            case 'netcallRejected':
                return '对方已拒绝';
            default:
                return '';
        }
    }
    /**--------------------正剧在下面------------------------*/
    switch ( type ) {
        case 'addTeamMembers':
            accounts = item.attach.accounts;
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i] === userUID) {
                    member.push("你");
                } else {
                    member.push( getNick( accounts[ i ] ) );
                }
            }
            member = member.join(",");
            str = from ? "你将" + member + "加入" + tName : member + "加入" + tName;
            return str;
        case 'removeTeamMembers':
            accounts = item.attach.accounts;
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i] === userUID) {
                    member.push("你");
                } else {
                    member.push(getNick(accounts[i]));
                }
            }
            member = member.join(",");
            str = from ? ("你将" + member + "移出" + tName) : (member + "被移出" + tName);
            return str;
        case 'leaveTeam':
            member = (item.from === userUID) ? "你" : getNick(item.from);
            str = member + "退出了" + tName;
            return str;
        case 'updateTeam':
            if (item.attach.team.joinMode) {
                switch (item.attach.team.joinMode) {
                    case "noVerify":
                        str = "群身份验证模式更新为允许任何人加入";
                        break;
                    case "needVerify":
                        str = "群身份验证模式更新为需要验证消息";
                        break;
                    case "rejectAll":
                        str = "群身份验证模式更新为不允许任何人申请加入";
                        break;
                    default:
                        str = '更新群消息';
                        break;
                }
            } else if (item.attach.team.name) {
                var user = (item.from === userUID) ? "你" : getNick(item.from);
                str = user + "更新" + tName + "名称为" + item.attach.team.name;
            } else if (item.attach.team.intro) {
                var user = (item.from === userUID) ? "你" : getNick(item.from);
                str = user + "更新群介绍为" + item.attach.team.intro;
            } else if (item.attach.team.inviteMode) {
                str = item.attach.team.inviteMode === 'manager' ? '邀请他人权限为管理员' : '邀请他人权限为所有人';
            } else if (item.attach.team.beInviteMode) {
                str = item.attach.team.beInviteMode === 'noVerify' ? '被邀请他人权限为不需要验证' : '被邀请他人权限为需要验证';
            } else if (item.attach.team.updateTeamMode) {
                str = item.attach.team.updateTeamMode === 'manager' ? '群资料修改权限为管理员' : '群资料修改权限为所有人';
            } else if (item.attach.team.avatar) {
                var user = (item.from === userUID) ? "你" : getNick(item.from);
                str = user + "更改了群头像";
            } else {
                str = '更新群消息';
            }
            return str;
        case 'acceptTeamInvite':
            var admin;
            if (item.from === item.attach.account) {
                member = (item.from === userUID) ? "你" : getNick(item.from);
                str = member ? member : item.from + "加入了群";
            } else {
                admin = (item.attach.account === userUID) ? "你" : getNick(item.attach.account);
                member = (item.from === userUID) ? "你" : getNick(item.from);
                str = member + '接受了' + admin + "的入群邀请";
            }
            return str;
        case 'passTeamApply':
            var admin;
            if (item.from === item.attach.account) {
                member = (item.from === userUID) ? "你" : getNick(item.from);
                str = member + "加入了群";
            } else {
                member = (item.attach.account === userUID) ? "你" : getNick(item.attach.account);
                admin = (item.from === userUID) ? "你" : getNick(item.from);
                str = admin + '通过了' + member + "的入群申请";
            }
            return str;
        case 'dismissTeam':
            member = (item.from === userUID) ? "你" : getNick(item.from);
            str = member + "解散了群";
            return str;
            break;
        case 'updateTeamMute':
            var account = item.attach.account,
                name;
            if (account === userUID) {
                name = '你';
            } else {
                name = getNick(account);
            }
            str = name + '被' + ((item.from === userUID) ? '你' : '管理员') + (item.attach.mute ? '禁言' : '解除禁言');
            return str;
        default:
            return '通知消息';
    }
}

function getNetcallDurationText( allSeconds ) {
    let result = "";
    let hours, minutes, seconds;
    if ( allSeconds >= 3600 ) {
        hours = parseInt( allSeconds / 3600, 10 );
        result += ( "00" + hours ).slice( -2 ) + " : ";
    }
    if ( allSeconds >= 60 ) {
        minutes = parseInt( allSeconds % 3600 / 60, 10 );
        result += ( "00" + minutes ).slice( -2 ) + " : ";
    } else {
        result += "00 : ";
    }
    seconds = parseInt( allSeconds % 3600 % 60, 10 );
    result += ( "00" + seconds ).slice( -2 );
    return result;
};

//或者备注名或者昵称
export function getNick( account ) {
    return getUserData( getPersonById( account ) ).alias;
}