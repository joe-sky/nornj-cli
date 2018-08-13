import 'whatwg-fetch';
!window.requestAnimationFrame && (window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
});
import 'flarej/lib/styles/grid';
import 'flarej/lib/components/grid';
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
import { template as t, compileH, registerComponent } from 'nornj';
import { withRouter } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { observer, Provider, inject } from 'mobx-react';
import routes from './routes-web';
import './src/web/css/app.scss';
import RootStore from './src/stores/rootStore';
import { onSnapshot } from 'mobx-state-tree';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Notification from 'flarej/lib/components/antd/notification';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { createNotification } from './src/utils/notification';
createNotification(Notification);
import Header from './src/web/components/header';
import Sider from './src/web/components/sider';
const HeaderWithRouter = withRouter(Header);
const SiderWithRouter = withRouter(Sider);

const rootStore = RootStore.create({});
// onSnapshot(rootStore, (snapshot) => {
//   console.log(snapshot)
// })

const renderApp = appRoutes => {
  ReactDOM.render(t`
    <${LocaleProvider} locale=${zhCN}>
      <mobx-Provider store=${rootStore}>
        <HashRouter>
          <div id="outer-container">
            <${HeaderWithRouter} />
            <${SiderWithRouter} />
            ${appRoutes()}
          </div>
        </HashRouter>
      </mobx-Provider>
    </${LocaleProvider}>
  `, document.getElementById('app'));
};
renderApp(routes);

if (module.hot) {
  module.hot.accept('./routes-web', () => {
    const newRoutes = require('./routes-web').default;
    renderApp(newRoutes);
  });
}