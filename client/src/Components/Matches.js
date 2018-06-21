import React, { Component } from 'react';

function listItemsInArray(items) {
  if (items) {
    var result = items.map(function(item) {
      return <p>{item}</p>
    })
  }

  return result;
}

class Matches extends Component {
  render() {

    if(this.props.data) {
      var matches = this.props.data.map(function(matchInfo) {
        var minutes = Math.floor(matchInfo.matchLength / 60);
        var seconds = matchInfo.matchLength - (minutes * 60);
        var timeString = `${minutes}:${seconds}`
        var items = listItemsInArray(matchInfo.finalItems);
        var runes = listItemsInArray(matchInfo.runes);

        return <div class="row" key={matchInfo.outcome}>
          <div class="column">
            <h3>MATCH</h3>
            <p>Result - {matchInfo.outcome}</p>
            <p>Length - {timeString}</p>
            <p>Champion - {matchInfo.champion}</p>
            <p>Final Level - {matchInfo.finalLevel}</p>
            <p>KDA - {matchInfo.KDA}</p>
          </div>
          <div class="column">
            <h3>ITEMS</h3>
            {items}
          </div>
          <div class="column">
            <h3>RUNES</h3>
            {runes}
          </div>
          <div class="column">
            <h3>CREEP INFO</h3>
            <p>Creep Score - {matchInfo.creepScore}</p>
            <p>CS/min - {matchInfo.creepScorePerMin}</p>
          </div>
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