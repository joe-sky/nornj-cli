import React, { Suspense } from 'react';
import { Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Loading from '@/components/loading';

const PageWrap = inject('store')(
  observer(({ store, children }) => (
    <div id="page-wrap" className={store.sider.isOpen ? 'isMenuOpen' : ''}>
      {children}
    </div>
  ))
);

const DefaultExample = React.lazy(() => import(/* webpackChunkName: "defaultExample" */ '../pages/defaultExample'));
const ChartExample = React.lazy(() => import(/* webpackChunkName: "chartExample" */ '../pages/chartExample'));
const FormExample = React.lazy(() => import(/* webpackChunkName: "formExample" */ '../pages/formExample'));
const EmptyExample = React.lazy(() => import(/* webpackChunkName: "emptyExample" */ '../pages/emptyExample'));
//{pageComponent}//

const Routes = () => (
  <Suspense fallback={<Loading />}>
    <PageWrap>
      <Switch>
        <Route exact path="/" component={DefaultExample} />
        <Route exact path="/DefaultExample" component={DefaultExample} />
        <Route exact path="/ChartExample" component={ChartExample} />
        <Route exact path="/FormExample" component={FormExample} />
        <Route exact path="/EmptyExample" component={EmptyExample} />
        {/*{route}*/}
        <Redirect from="*" to="/" />
      </Switch>
    </PageWrap>
  </Suspense>
);

export default Routes;
