import { store } from "../redux/store";
import {addMsgs} from "../redux/actions";
import {getTeamById} from "../redux/store/storeBridge";
import {updateTeam} from "../redux/actions/teamMap";

export function messageHandler( msg ) {
    let type = msg.attach.type,
        team = msg.attach.team;
    switch (type) {
		case 'updateTeam':		// 更新群
			updateTeamNotification( msg );
			break;
        default:				// 其他
			store.dispatch( addMsgs( msg ) );
			break;
	}
}

// function updateTeamNotification( msg, nim ) {
function updateTeamNotification ( msg ) {
    let team = msg.attach.team,
        teamId = msg.attach.team.teamId;
    let oldTeam = getTeamById( teamId ),
        newTeam;
    newTeam = { ...oldTeam, ...team };
    store.dispatch( updateTeam( teamId, newTeam ) );
    store.dispatch( addMsgs( msg ) );
}