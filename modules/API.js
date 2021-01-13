const DB = require('./SQL');

exports.checkPlayer = async name => {
    let players = await DB.getPlayers();
    let player = players.filter(p => p.IGN == name);

    if (player.length == 0) return [false];
    return [true, player[0].teamID];
}

exports.saveGame = async body => {
    await DB.recordLoLGame(body.gameId, body.metaData.matchID, body.startTime, body.metaData.team1_ID, body.metaData.team2_ID, body.metaData.win_ID, body.metaData.description, body.shortCode);

    let games = await DB.getGames();
    let fGames = games.filter(g => g.MatchID == body.metaData.matchID);

    let scores = {};
    scores[body.metaData.team1_ID] = 0;
    scores[body.metaData.team2_ID] = 0;

    for (var i in fGames) scores[fGames[i].WinningTeam_ID]++;

    await DB.recordGame(body.metaData.matchID, scores[body.metaData.team1_ID], scores[body.metaData.team2_ID])
    if (scores[body.metaData.team1_ID] == 2 || scores[body.metaData.team2_ID] == 2) return [true, scores];
    // if (scores[body.metaData.team1_ID] > 2 || scores[body.metaData.team2_ID] > 2) return [true, scores];

    return [false, scores];
}