import { cutObjArray, mergeObjArray } from "../util";

export class IMUtil {

    static mergeSessions( olds, news ) {
        return mergeObjArray( olds, news, { sortPath: 'updateTime', desc: true } );
    }

    static mergeFriends( olds, news ) {
        return mergeObjArray( olds, news, { keyPath: 'account' } );
    }

    static mergeUsers( olds, news ) {
        return mergeObjArray( olds, news, { keyPath: 'account' } )
    }

    static mergeTeams( olds, news ) {
        return mergeObjArray( olds, news, { keyPath: 'teamId' } )
    }

    static mergeTeamMembers( olds, news ) {
        return mergeObjArray( olds, news, {} );
    }

    static mergeRelations( olds, news ) {
        return mergeObjArray( olds, news, { keyPath: 'account' } )
    }

    static cutFriends( olds, invalids ) {
        console.log( "cut friends" );
        return cutObjArray( olds, invalids, { keyPath: 'account' } );
    }

    static cutFriendsByAccounts( olds, accounts ) {
        Array.isArray( accounts ) || ( accounts = [ accounts ] );
        let invalids = accounts.map( account => ( { account } ) );
        return this.cutFriends( olds, invalids );
    }

    static cutTeamMembers( olds, invalids ) {
        return cutObjArray( olds, invalids, {} ); // deafult keyPath: 'id'
    }

    static cutTeams( olds, invalids ) {
        return cutObjArray( olds, invalids, { keyPath: 'teamId' } );
    }

    static cutRelations( olds, invalids ) {
        return cutObjArray( olds, invalids, { keyPath: 'account' } );
    }

}