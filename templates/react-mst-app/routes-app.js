import React from 'react';
import Bundle from './Bundle';
import { withRouter, Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { observer, Provider, inject } from 'mobx-react';
import { AppFunctions, ConfigApp } from './src/app/config/app';
import Home from 'bundle-loader?lazy&name=[name]!./src/app/pages/home/home.jsx';
import ChartExample from 'bundle-loader?lazy&name=[name]!./src/app/pages/chartExample/chartExample.jsx';
import ListExample from 'bundle-loader?lazy&name=[name]!./src/app/pages/listExample/listExample.jsx';
//{importLoadPage}//

//默认Icon
const iconDefault = require('./src/app/images/icon-default.png');

// prettier-ignore
const FUNC_COMPONENTS = {
  ChartExample: {
    //icon: require('./src/app/images/icon-default.png'),
    component: ChartExample
  },
  ListExample: {
    //icon: require('./src/app/images/icon-default.png'),
    component: ListExample
  },
  //{FUNC_COMPONENTS}//
};

//默认页
const ROUTES = [
  {
    key: 'home',
    path: '/',
    title: '首页',
    component: Home
  }
];

//功能列表
export const FUNCS = [];
if (AppFunctions && AppFunctions instanceof Array) {
  for (let appFunction of AppFunctions) {
    const modules = [];
    let mods = [];
    if (appFunction.children && appFunction.children instanceof Array) {
      for (let i = 0; i < appFunction.children.length; i++) {
        const mod = appFunction.children[i];
        let newMod = {
          key: mod.index,
          path: mod.link,
          title: mod.name,
          disabled: mod.disabled
        };
        mods.push(newMod);
        if (i > 0 && (i + 1) % ConfigApp.home.funcsPerRow === 0) {
          modules.push(mods);
          mods = [];
        }
        //
        if (FUNC_COMPONENTS[newMod.key]) {
          const func = FUNC_COMPONENTS[newMod.key];
          if (func) {
            newMod.icon = func.icon;
            newMod.component = func.component;
            if (newMod.path) {
              ROUTES.push(newMod);
            }
          }
        }
        if (!newMod.icon) {
          newMod.icon = iconDefault;
        }
      }
      if (mods.length > 0 && mods.length < ConfigApp.home.funcsPerRow) {
        let diff = ConfigApp.home.funcsPerRow - mods.length;
        for (let j = 0; j < diff; j++) {
          mods.push({ key: `null_${j}` });
        }
        modules.push(mods);
      }
    }
    FUNCS.push({
      key: appFunction.index,
      title: appFunction.name,
      modules: modules
    });
  }
}

const AppRoute = ({ module: module, store, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Bundle load={module.component} store={store}>
        {load => {
          const Component = withRouter(load);
          return <Component moduleName={module.title} />;
        }}
      </Bundle>
    )}
  />
);

const routes = store => {
  return (
    <Switch>
      {ROUTES.map((module, i) => {
        return <AppRoute exact path={module.path} module={module} key={module.key} store={store} />;
      })}
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default routes;