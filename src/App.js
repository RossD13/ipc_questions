import React, { Component } from 'react';
import logo from './ipc.png';
import './App.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import './questionTable';




class App extends Component {
    constructor() {
                 super();
                 this.state = {count: 0};
                 this.increment = this.increment.bind(this);
             }
    increment() {
               this.setState({count: this.state.count + 1});
            }


    render() {
    return (
        <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" size="100"/>
          <h1 className="App-title">IPC Questions Maintenance Screen</h1>
        </header>


      </div>


  </div>

  );
  }
}

export default App;
