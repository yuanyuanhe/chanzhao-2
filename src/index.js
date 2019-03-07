import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import createHistory from "history/createBrowserHistory"
//redux
import { Provider } from 'react-redux'//, connect
import { store } from "./redux/store";

//serviceWorker
import registerServiceWorker from './registerServiceWorker';
//Loadable
// import Loadable from 'react-loadable';
//Router
import { Router } from "react-router-dom";
// import { mtsdk } from './components/Data/mtsdk';
import { checkSrcHost,convertSrcWebp,convertIconSrc } from './util'
String.prototype.checkSrcHost = checkSrcHost;
String.prototype.convertSrcWebp = convertSrcWebp;
String.prototype.convertIconSrc = convertIconSrc;
!!Promise && ( !Promise.prototype.finally && ( Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
} ) );
export const history = createHistory();
ReactDOM.render( (
    <Provider store={store}>
        <Router history={history}>
            <Main/>
        </Router>
    </Provider> ) , document.getElementById('root'));
registerServiceWorker();
