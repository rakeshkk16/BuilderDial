/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// chrome.storage.local.get(null, function (data) {
//     ReactDOM.render(
//       <App {...data} isExt={false}/>,
//       document.getElementById('root')
//     )
//   });
ReactDOM.render(<App isExt={false}/>, document.getElementById('root'));
registerServiceWorker();
