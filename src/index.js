import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DataTableColResizeDemo from './questionTable'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));


ReactDOM.render(<DataTableColResizeDemo />, document.getElementById('table'));

registerServiceWorker();
