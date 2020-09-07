import React from 'react';
import logo from './logo.svg';
import './App.css';
import makeTreeFlat from './makeTreeFlat';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flatData: []
    }
  }

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:5000/', { method: 'GET', mode: 'cors' });
      if(!res.ok){
        throw new Error(`${res.status}:${res.statusText}`);
      }
      const data = await res.json();
      console.log(data);
      const flatData = makeTreeFlat(data);
      console.log(flatData);
      this.setState({
        flatData
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>*/}
        {this.state.flatData.map(function(x, i) { return <p key={i} style={ ({marginLeft: `${x.nested * 10}px`}) }>{x.name} ({x.type})</p> })}
      </div>
    );
  }
}

export default App;
