import React from 'react';
import Bundle from './bundle'
import { withRouter, Redirect } from 'react-router'
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import loadPage1_1 from 'bundle-loader?lazy&name=[name]!./src/web/pages/page1_1/page1_1.js';
import loadPage1_2 from 'bundle-loader?lazy&name=[name]!./src/web/pages/page1_2/page1_2.js';
import Header from './src/web/components/header';
import Sider from './src/web/components/sider';

const HeaderWithRouter = withRouter(Header)
const SiderWithRouter = withRouter(Sider)
const loadBundles = {
  loadPage1_1,
  loadPage1_2,
};

/**
 * 页面1-1
 */
const Page1_1 = inject("store")(
  observer(({ store }) => nj`
    <${PageWrap}>
      <${Bundle} load=${loadPage1_1} store=${store} isPc loadBundles=${loadBundles}>
        ${(_Page1_1) => {
          const Page1_1 = withRouter(_Page1_1)
          return nj`<${Page1_1}/>`();
        }}
      </${Bundle}>
    </${PageWrap}>
  `())
);

/**
 * 页面1-2
 */
const Page1_2 = inject("store")(
  observer(({ store }) => nj`
    <${PageWrap}>
      <${Bundle} load=${loadPage1_2} store=${store} isPc loadBundles=${loadBundles}>
        ${(_Page1_2) => {
          const Page1_2 = withRouter(_Page1_2)
          return nj`<${Page1_2}/>`();
        }}
      </${Bundle}>
    </${PageWrap}>
  `())
);

const PageWrap = inject("store")(
  observer(({ store, children }) => nj`
    <div>
      <${SiderWithRouter}/>
      <${HeaderWithRouter}/>
      <div id="page-wrap" className=${store.sider.isOpen ? 'isMenuOpen' : ''}>
        ${children}
      </div>
    </div>
  `())
);

const routes = () => nj`
  <router-Switch>
    <Route exact path='/' component=${Page1_1}/>
    <Route exact path='/Page1_1' component=${Page1_1} />
    <Route exact path='/Page1_2' component=${Page1_2} />
    <Redirect from='*' to='/'/>
  </router-Switch>
`();

export default routes;