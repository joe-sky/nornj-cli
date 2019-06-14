import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
React.createClass = createClass;
React.PropTypes = PropTypes;
import './utils/nj.config';
import { withRouter } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import routes from './router';
import './assets/app.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from './components/header';
import Sider from './components/sider';
const HeaderWithRouter = withRouter(Header);
const SiderWithRouter = withRouter(Sider);
import { hot } from 'react-hot-loader/root';

const App = ({ store }) => (
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <HashRouter>
        <div id="outer-container">
          <HeaderWithRouter />
          <SiderWithRouter />
          {routes()}
        </div>
      </HashRouter>
    </Provider>
  </LocaleProvider>
);

export default hot(App);
