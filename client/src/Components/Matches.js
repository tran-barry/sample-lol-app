import React, { Component } from 'react';

class Matches extends Component {
  render() {

    if(this.props.data) {
      var matches = this.props.data.map(function(matchInfo) {
        return <div key={matchInfo.outcome}>
          <p>{matchInfo.outcome}</p>
          <p>{matchInfo.matchLength}</p>
        </div>
      })
    }

    return (
      <section id="matches">
        {matches}
      </section>
    );
  }
}

export default Matches;