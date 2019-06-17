import React, { Suspense } from 'react';
import { withRouter, Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import Loading from '../components/loading';
import getInitialInfo from './getInitialInfo';

const DefaultExample = inject('store')(
  observer(({ store }) => {
    const DefaultExamplePage = React.lazy(async () => {
      await getInitialInfo(store);
      return import(/* webpackChunkName: "defaultExample" */ '../pages/defaultExample');
    });

    return (
      <PageWrap>
        <DefaultExamplePage />
      </PageWrap>
    );
  })
);

const ChartExample = inject('store')(
  observer(({ store }) => {
    const ChartExamplePage = React.lazy(async () => {
      await getInitialInfo(store);
      return import(/* webpackChunkName: "chartExample" */ '../pages/chartExample');
    });

    return (
      <PageWrap>
        <ChartExamplePage />
      </PageWrap>
    );
  })
);

const FormExample = inject('store')(
  observer(({ store }) => {
    const FormExamplePage = React.lazy(async () => {
      await getInitialInfo(store);
      return import(/* webpackChunkName: "formExample" */ '../pages/formExample');
    });

    return (
      <PageWrap>
        <FormExamplePage />
      </PageWrap>
    );
  })
);

const EmptyExample = inject('store')(
  observer(({ store }) => {
    const EmptyExamplePage = React.lazy(async () => {
      await getInitialInfo(store);
      return import(/* webpackChunkName: "emptyExample" */ '../pages/emptyExample');
    });

    return (
      <PageWrap>
        <EmptyExamplePage />
      </PageWrap>
    );
  })
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
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={DefaultExample} />
      <Route exact path="/DefaultExample" component={DefaultExample} />
      <Route exact path="/ChartExample" component={ChartExample} />
      <Route exact path="/FormExample" component={FormExample} />
      <Route exact path="/EmptyExample" component={EmptyExample} />
      {/*{route}*/}
      <Redirect from="*" to="/" />
    </Switch>
  </Suspense>
);

export default routes;