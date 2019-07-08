import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/App';
import RootStore from '@/stores/root.mst';
const rootStore = RootStore.create({});

const render = App => {
  ReactDOM.render(<App store={rootStore} />, document.getElementById('app'));
};
render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const App = require('./App').default;
    render(App);
  });
}
