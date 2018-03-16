import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DataTableColResizeDemo from './questionTable'
import registerServiceWorker from './registerServiceWorker';
import EditForm from './editForm';


ReactDOM.render(<App />, document.getElementById('root'));


ReactDOM.render(<DataTableColResizeDemo />, document.getElementById('table'));

//ReactDOM.render(<EditForm />, document.getElementById('edit'));

registerServiceWorker();
