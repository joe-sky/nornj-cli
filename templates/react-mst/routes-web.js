import React from 'react';
import Bundle from './Bundle';
import { withRouter, Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import loadDefaultExample from 'bundle-loader?lazy&name=[name]!./src/web/pages/defaultExample/defaultExample';
import loadChartExample from 'bundle-loader?lazy&name=[name]!./src/web/pages/chartExample/chartExample';
import loadFormExample from 'bundle-loader?lazy&name=[name]!./src/web/pages/formExample/formExample';
import loadEmptyExample from 'bundle-loader?lazy&name=[name]!./src/web/pages/emptyExample/emptyExample';
//{importLoadPage}//

// prettier-ignore
const loadBundles = {
  loadDefaultExample,
  loadChartExample,
  loadFormExample,
  loadEmptyExample,
  //{loadPage}//
};

/**
 * 页面defaultExample
 */
const DefaultExample = inject('store')(
  observer(({ store }) => (
    <PageWrap>
      <Bundle load={loadDefaultExample} store={store} loadBundles={loadBundles}>
        {(_DefaultExample) => {
          const DefaultExample = withRouter(_DefaultExample);
          return <DefaultExample />;
        }}
      </Bundle>
    </PageWrap>
  ))
);

/**
 * 页面chartExample
 */
const ChartExample = inject('store')(
  observer(({ store }) => (
    <PageWrap>
      <Bundle load={loadChartExample} store={store} loadBundles={loadBundles}>
        {(_ChartExample) => {
          const ChartExample = withRouter(_ChartExample);
          return <ChartExample />;
        }}
      </Bundle>
    </PageWrap>
  ))
);

/**
 * 页面formExample
 */
const FormExample = inject('store')(
  observer(({ store }) => (
    <PageWrap>
      <Bundle load={loadFormExample} store={store} loadBundles={loadBundles}>
        {(_FormExample) => {
          const FormExample = withRouter(_FormExample);
          return <FormExample />;
        }}
      </Bundle>
    </PageWrap>
  ))
);

/**
 * 页面emptyExample
 */
const EmptyExample = inject('store')(
  observer(({ store }) => (
    <PageWrap>
      <Bundle load={loadEmptyExample} store={store} loadBundles={loadBundles}>
        {(_EmptyExample) => {
          const EmptyExample = withRouter(_EmptyExample);
          return <EmptyExample />;
        }}
      </Bundle>
    </PageWrap>
  ))
);

//{pageComponent}//

const PageWrap = inject('store')(
  observer(({ store, children }) => (
    <div id="page-wrap" className={store.sider.isOpen ? 'isMenuOpen' : ''}>
      {children}
    </div>
  ))
);

const routes = () => (
  <Switch>
    <Route exact path="/" component={DefaultExample} />
    <Route exact path="/DefaultExample" component={DefaultExample} />
    <Route exact path="/ChartExample" component={ChartExample} />
    <Route exact path="/FormExample" component={FormExample} />
    <Route exact path="/EmptyExample" component={EmptyExample} />
    {/*//{route}//*/}
    <Redirect from="*" to="/" />
  </Switch>
);

export default routes;