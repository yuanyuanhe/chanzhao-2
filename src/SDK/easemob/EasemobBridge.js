import { store } from "../../redux/store";
import { isNetease } from "../../util";

let WebIM = window.WebIM;
// console.log( "😈", WebIM );
if ( !isNetease() ) {
    let conn = new WebIM.connection( WebIM.config );
}

// conn.listen({
//     onOpened
// })

export class EasemobBridge {

}
