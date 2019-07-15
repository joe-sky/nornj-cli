import React, { useState, useEffect } from 'react';
import '@/utils/nj.config';
import { withRouter } from 'react-router';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Provider } from 'mobx-react';
import Routes from './router';
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
import Loading from '@/components/loading';
import Header from '@/components/header';
import Sider from '@/components/sider';
const HeaderWithRouter = withRouter(Header);
const SiderWithRouter = withRouter(Sider);
const history = createHashHistory();

const App = ({ store }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    history.listen((location, action) => {
      store.sider.setCurrentMenu(location);
    });

    store.common.getCurrentUserInfo().then(() => {
      store.sider.setCurrentMenu(history.location);
      setIsLoading(false);
    });
  }, []);

  return (
    <If condition={isLoading}>
      <Loading />
      <Else>
        <LocaleProvider locale={antZhCN}>
          <Provider store={store}>
            <Router history={history}>
              <div id="outer-container">
                <HeaderWithRouter />
                <SiderWithRouter />
                <Routes />
              </div>
            </Router>
          </Provider>
        </LocaleProvider>
      </Else>
    </If>
  );
};

export default App;
