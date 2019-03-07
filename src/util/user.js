import {getMtsdk, getPersonById, getTeamMembers} from "../redux/store/storeBridge";
import {store} from "../redux/store";
import {setTeamMembers, updatePersonList} from "../redux/actions";

export function checkUsersData( accounts ) {
    return new Promise( ( resolve, reject ) => {
        let cache = [];
        accounts.forEach( ( account ) => {
            if ( !getPersonById( account ) ) {
                cache.push( account );
            }
        } );
        if ( cache.length === 0 ) {
            return resolve();
        }
        let mtsdk = getMtsdk();
        mtsdk.getUsers( cache ).then( () => {
            resolve();
        } ).catch( e => {
            console.log( e );
            reject();
        } );
    } );
}

/**
 * getTeamMembers:
 * return { teamId: '', members:[] }
*/
export function checkTeamMemberUserData( teamId ) {
    if ( !teamId ) {
        return;
    }
    let members = getTeamMembers( teamId );
    if ( !!members ) {
        getTeamMembersData( teamId );
    } else {
        let mtsdk = getMtsdk();
        mtsdk.getTeamMembers( teamId ).then( () => {
            getTeamMembersData( teamId );
        } );
    }
}

/**
 * get data of members who is not in cache
*/
function getTeamMembersData( teamId ) {
    let members = getTeamMembers( teamId ),
        accounts = [];
    members = !!members && members.members || [];
    members.forEach( ( { account } ) => {
        if ( !getPersonById( account ) ) {
            accounts.push( account );
        }
    } );
    if ( accounts.length === 0 ) {
        return true;
    }
    let mtsdk = getMtsdk();
    mtsdk.getUsers( accounts ).catch( e => console.log( e ) );
}