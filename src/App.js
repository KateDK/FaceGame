import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import drawCanvas from './ctracker';
const logo = require('./LogoMakr_6HzPXI.png');
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="top">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Lets make some faces!</h1>
          </header>
          <p className="App-intro" />
        </div>
        <div className="AppBody">
          {/* <canvas id="myCanvas" width="400" height="400" />

          <video id="inputVideo" width="400" height="400" autoPlay loop>
            <source src="./media/somevideo.ogv" type="video/ogg" />
          </video> */}
        </div>
      </div>
    );
  }
}

export default App;
