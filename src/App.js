import logo from './logo.svg';
import React from 'react';
import './App.css';
import './index.css';
import NavbarComponent from './components/NavbarComponent/NavbarComponent.js'
import MyTopComponent from './components/MyTopComponent/MyTopComponent.js'

function App() {
  return (
    <div className="App">
      <NavbarComponent></NavbarComponent>
      <MyTopComponent></MyTopComponent>
    </div>
  );
}

export default App;
