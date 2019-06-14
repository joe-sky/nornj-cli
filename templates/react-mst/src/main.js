import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RootStore from './stores/rootStore';
const rootStore = RootStore.create({});

ReactDOM.render(<App store={rootStore} />, document.getElementById('app'));
