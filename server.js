const express = require('express');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var Client = require('node-rest-client').Client;

const app = express();
const port = process.env.PORT || 5000;
var client = new Client();
var xhttp = new XMLHttpRequest();
const riotUrl = 'https://na1.api.riotgames.com';
const apiKey = 'RGAPI-d62433f4-5204-4a11-8011-2dcbc330df72';

app.get('/api/lastTenMatches/:summonerName', (req, res) => {
  var summoner = GetSummoner(req.param('summonerName'));
  var matches = GetSummonerMatches(summoner.accountId);
  var matchDetails = matches.map((match) => {
    return GetMatchDetails(match.gameId);
  });
  
  // No need to get this multiple times, should just cache this info
  var runes = GetRuneInfo();
  var champions = GetChampionInfo();
  var items = GetItemInfo();


  var results = matchDetails.map((match) => {
    result = {};
    var participantIdentity = match.participantIdentities.find((id) => id.player.accountId  === summoner.accountId);
    var participant = match.participants.find((id) => id.participantId === participantIdentity.participantId);
    var team = match.teams.find((id) => id.teamId === participant.teamId);

    result.outcome = GetOutcome(team);
    result.matchLength = GetMatchLength(match);
    result.runes = GetRuneNames(participant, runes);
    result.champion = GetChampionName(participant.championId, champions);
    result.KDA = GetKDA(participant);
    result.finalItems = GetFinalItems(participant, items);
    
    return result;
  });

  res.send({express: results});
})

function GetRuneInfo() {
  var url = `https://ddragon.leagueoflegends.com/cdn/8.11.1/data/en_US/runesReforged.json`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  // Build a flat list of runes. For whatever reason, concat wouldn't work, so had to do a bunch of for-loops.
  var runes = [];
  for (var i = 0; i < response.length; ++i) {
    for (var j = 0; j < response[i].slots.length; ++j) {
      for (var k = 0; k < response[i].slots[j].runes.length; k++) {
        runes.push(response[i].slots[j].runes[k]);
      }
    }
  }

  return runes;
}

function GetChampionInfo() {
  var url = `https://ddragon.leagueoflegends.com/cdn/8.11.1/data/en_US/champion.json`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  return response.data;
}

function GetItemInfo() {
  var url = `https://ddragon.leagueoflegends.com/cdn/8.11.1/data/en_US/item.json`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  return response.data;
}

function GetSummoner(summonerName) {
  var path = `lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${apiKey}`;
  var url = `${riotUrl}/${path}`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  return response;
}

function GetSummonerMatches(summonerId) {
  //var path = `lol/match/v3/matchlists/by-account/${summonerId}?api_key=${apiKey}&endIndex=10`;
  var path = `lol/match/v3/matchlists/by-account/${summonerId}?api_key=${apiKey}&endIndex=1`;
  var url = `${riotUrl}/${path}`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  
  var response = JSON.parse(xhttp.responseText);

  return response.matches;
}

function GetMatchDetails(matchId) {
  var path = `lol/match/v3/matches/${matchId}?api_key=${apiKey}`;
  var url = `${riotUrl}/${path}`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
  
  var response = JSON.parse(xhttp.responseText);

  return response;
}

function GetOutcome(team) { return team.win; }
function GetMatchLength(matchDetails) { return matchDetails.gameDuration; }
function GetRuneNames(participant, runes) { 
  runeNames = [];
  runeNames.push(GetRuneName(participant.stats.perk0, runes));
  runeNames.push(GetRuneName(participant.stats.perk1, runes));
  runeNames.push(GetRuneName(participant.stats.perk2, runes));
  runeNames.push(GetRuneName(participant.stats.perk3, runes));
  runeNames.push(GetRuneName(participant.stats.perk4, runes));
  runeNames.push(GetRuneName(participant.stats.perk5, runes));

  return runeNames;
}
function GetRuneName(runeId, runes) {
  var rune = runes.find((rune) => rune.id === runeId);
  return rune.name;
}
function GetChampionName(championId, champions) {
  var champion = Object.values(champions).find((ch) => ch.key === championId.toString());
  console.log(champion);
  return champion.name;
}
function GetKDA(participant) { 
  var kills = participant.stats.kills;
  var deaths = participant.stats.deaths;
  var assists = participant.stats.assists;
  return `${kills}/${deaths}/${assists}`;
}
function GetFinalItems(participant, items) {
  itemNames = [];
  itemNames.push(GetItemName(participant.stats.item0, items));
  itemNames.push(GetItemName(participant.stats.item1, items));
  itemNames.push(GetItemName(participant.stats.item2, items));
  itemNames.push(GetItemName(participant.stats.item3, items));
  itemNames.push(GetItemName(participant.stats.item4, items));
  itemNames.push(GetItemName(participant.stats.item5, items));
  itemNames.push(GetItemName(participant.stats.item6, items));

  return itemNames;
}
function GetItemName(itemId, items) {
  var item = items[`${itemId}`];
  console.log(item);
  return item.name;
}

app.listen(port, () => console.log(`Listening on port ${port}`));