const express = require('express');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var Client = require('node-rest-client').Client;

const app = express();
const port = process.env.PORT || 5000;
var client = new Client();
var xhttp = new XMLHttpRequest();
const riotUrl = 'https://na1.api.riotgames.com';
const apiKey = 'REPLACE ME'

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
    //result.finalItems = GetFinalItems(participant, items);
    
    return result;
  });

  res.send({express: results});
})

function GetRuneInfo() {
  var path = `lol/static-data/v3/reforged-runes?api_key=${apiKey}`;
  var url = `${riotUrl}/${path}`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);

  return response;
}

function GetChampionInfo() {
  var path = `lol/static-data/v3/champions?api_key=${apiKey}`;
  var url = `${riotUrl}/${path}`;

  xhttp.open("GET", url, false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

  var response = JSON.parse(xhttp.responseText);
  console.log(response);

  return response.data;
}

function GetItemInfo() {
  var path = `lol/static-data/v3/items?api_key=${apiKey}`;
  var url = `${riotUrl}/${path}`;

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
  var champion = Object.values(champions).find((ch) => ch.id === championId);
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
  var item = Object.values(items).find((it) => it.id === itemId);
  console.log(item);
  return item.name;
}

app.listen(port, () => console.log(`Listening on port ${port}`));