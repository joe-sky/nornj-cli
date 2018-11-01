import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
React.createClass = createClass;
React.PropTypes = PropTypes;
import nj from 'nornj';
import 'nornj-react/mobx';
import 'nornj-react/router';
import './src/utils/nj.configs';
import { withRouter } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { observer, Provider, inject } from 'mobx-react';
import routes from './routes-app';
import './src/app/css/app.scss';
import RootStore from './src/stores/rootStoreApp';
import { onSnapshot } from 'mobx-state-tree';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { Toast, Modal, LocaleProvider } from 'antd-mobile';
//import enUS from 'antd-mobile/lib/locale-provider/en_US'
import { createNotification } from './src/utils/notification';
createNotification([Toast, Modal], true);
import Header from './src/app/components/header';
const HeaderWithRouter = withRouter(Header);

const rootStore = RootStore.create({});
// onSnapshot(rootStore, (snapshot) => {
//   console.log(snapshot)
// })

const renderApp = appRoutes => {
  ReactDOM.render(
    // <LocaleProvider locale={enUS}>
    <Provider store={rootStore}>
      <HashRouter>
        <div id="outer-container">
          <HeaderWithRouter />
          {appRoutes(rootStore)}
        </div>
      </HashRouter>
    </Provider>,
    // </LocaleProvider>
    document.getElementById('app')
  );
};
renderApp(routes);

if (module.hot) {
  module.hot.accept('./routes-app', () => {
    const newRoutes = require('./routes-app').default;
    renderApp(newRoutes);
  });
}
