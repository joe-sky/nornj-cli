import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RootStore from './stores/root.mst';
const rootStore = RootStore.create({});
import intl from 'react-intl-universal';
import enUS from './locales/en-US.js';
import zhCN from './locales/zh-CN.js';
const locales = {
  'en-us': enUS,
  'zh-cn': zhCN
};
intl.init({
  currentLocale: (navigator.language || navigator.browserLanguage).toLowerCase(),
  locales
});

ReactDOM.render(<App store={rootStore} />, document.getElementById('app'));
