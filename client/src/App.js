import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Matches from './Components/Matches';
import SummonerInput from './Components/SummonerInput';

async function callApi(path) {
  const response = await fetch(path);
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summonerName: '',
      showSpinner: false,
      matchInfo: null
    };
  }

  searchSummoner(name) {
    this.setState({ showSpinner: true });
    this.setState({ summonerName: name });
    this.setState({ matchInfo: null });
    callApi(`/api/lastTenMatches/${name}`)
      .then(res => this.setState({ matchInfo: res.express }))
      .then(() => this.setState({ showSpinner: false }))
      .catch(err => console.log(err));
  }

  render() {
    let spinner;
    if (this.state.showSpinner) {
      spinner = <img alt="" src="loader.gif" />;
    }
    else {
      spinner = null;
    }

    return (
      <div className="App">
        <SummonerInput nameHandler={this.searchSummoner.bind(this)} />
        <Matches data={this.state.matchInfo} />
        {spinner}
      </div>
    );
  }
}

export default App;
