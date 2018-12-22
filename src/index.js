import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import PianoBody from './components/PianoBody';
import Dashboard from './components/Dashboard';
import ResponsiveKeyboard from './components/ResponsiveKeyboard';

import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<PianoBody />, document.getElementById('piano-body'));
ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
ReactDOM.render(<ResponsiveKeyboard />, document.getElementById('keyboard'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
