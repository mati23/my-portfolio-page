import logo from './logo.svg';
import './App.css';
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
