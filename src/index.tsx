import React from 'react';
import ReactDOM from 'react-dom';
import uuidv4 from 'uuid/v4';
import { HashRouter, Route, Switch } from 'react-router-dom';

import $ from 'jquery';
import 'hammerjs';
import 'popper.js';

import I18n from './services/i18n';
import LoadingMask from './services/loading';
import MessageBox from './services/message';
import SourceStore from './services/store/source';
import RecordStore from './services/store/record';
import routers from './services/router';

import MainHeader from './components/toolbar/MainHeader';

import * as serviceWorker from './serviceWorker';

import './assets/css/main.scss';


(window as any).$ = $;

import('bootstrap').then(() => {
  ReactDOM.render((
    <I18n>
      <LoadingMask>
        <MessageBox>
          <HashRouter>
            <MainHeader />

            <div className="cash-map-app">
              <SourceStore>
                <RecordStore>
                  <Switch>
                    { routers.map(options => <Route key={uuidv4()} {...options} />) }
                  </Switch>
                </RecordStore>
              </SourceStore>
            </div>
          </HashRouter>
        </MessageBox>
      </LoadingMask>
    </I18n>
  ), document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});
