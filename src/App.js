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
      <div className="App"><header className="App-header">
          <div class="ui-g">
              <div class="ui-g-4"><img src={logo} alt="logo" size="50%"/></div>
              <div class="ui-g-4">

                        <h1 >

                     IPC Questions Maintenance Screen</h1>

              </div>
          </div></header>


      </div>


  </div>

  );
  }
}

export default App;
