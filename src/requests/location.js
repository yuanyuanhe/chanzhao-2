import { requestWithToken} from "./index";
import { getUrl} from "../redux/store/storeBridge";

export function sendGetLocationRequest() {
 //     response data format
 //    "msgId": "200",
 //    "location": [
 //     0.00000268220901489, //longitude
 //     0.00000126736058093  //latitude
 //   ]
    return requestWithToken( {
        url: getUrl( "getLocation" ),
        type: "get"
    } );
}