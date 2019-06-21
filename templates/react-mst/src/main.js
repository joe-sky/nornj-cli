import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RootStore from './stores/root.mst';
const rootStore = RootStore.create({});

ReactDOM.render(<App store={rootStore} />, document.getElementById('app'));
