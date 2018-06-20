import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Matches from './Components/Matches';

async function callApi(path) {
  const response = await fetch(path);
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
}

class App extends Component {
  state = {
    matchInfo: [{}]
  };


  componentDidMount() {
    callApi(`/api/lastTenMatches/Avein`)
      .then(res => this.setState({ matchInfo: res.express }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <p> {this.state.test} </p>
        <Matches data={this.state.matchInfo} />
      </div>
    );
  }
}

export default App;
