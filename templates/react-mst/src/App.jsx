import React from 'react';
import ReactDOM from 'react-dom';
import '@/utils/nj.config';
import { withRouter } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import routes from './router';
import '@/assets/app.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { LocaleProvider } from 'antd';
import antZhCN from 'antd/lib/locale-provider/zh_CN';
import intl from 'react-intl-universal';
import enUS from '@/locales/en-US.js';
import zhCN from '@/locales/zh-CN.js';
const locales = {
  en: enUS,
  'en-us': enUS,
  'zh-cn': zhCN
};
intl.init({
  currentLocale: (navigator.language || navigator.browserLanguage).toLowerCase(),
  locales
});
import Header from '@/components/header';
import Sider from '@/components/sider';
const HeaderWithRouter = withRouter(Header);
const SiderWithRouter = withRouter(Sider);
import { hot } from 'react-hot-loader/root';

const App = ({ store }) => (
  <LocaleProvider locale={antZhCN}>
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
