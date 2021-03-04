const DB = require('./SQL');

exports.getTeams = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();
    let players = await DB.getPlayers();

    for (var i in teams) {
        let temp = {
            id: teams[i].ID,
            name: schools.filter(s => s.ID == teams[i].schoolID)[0].teamName,
            abbrev: schools.filter(s => s.ID == teams[i].schoolID)[0].abbrev,
            logo: schools.filter(s => s.ID == teams[i].schoolID)[0].logo,
        }

        if (allinfo) {
            temp["school"] = {
                id: teams[i].schoolID,
                name: schools.filter(s => s.ID == teams[i].schoolID)[0].name,
                socials: {
                    instagram: schools.filter(s => s.ID == teams[i].schoolID)[0].igURL,
                    twitter: schools.filter(s => s.ID == teams[i].schoolID)[0].twitterURL,
                    twitch: schools.filter(s => s.ID == teams[i].schoolID)[0].twitchURL,
                }
            };

            temp["league"] = {
                id: teams[i].leagueID,
                title: leagues.filter(l => l.ID == teams[i].leagueID)[0].title,
            }

            temp["manager"] = {
                name: null,
                IGN: null
            } // TODO Add managers to database

            temp["coach"] = {
                name: null,
                IGN: null
            } // TODO Add coaches to database

            temp["players"] = [];

            let teamPlayers = players.filter(p => p.teamID == teams[i].ID);
            for (var j in teamPlayers) {
                temp.players.push({
                    id: teamPlayers[j].id,
                    firstName: teamPlayers[j].firstName,
                    lastName: teamPlayers[j].lastName,
                    IGN: teamPlayers[j].IGN,
                    role: teamPlayers[j].role,
                })
            }

            if (temp.players.length == 0) temp.players = null;
        }
        else {
            temp["schoolID"] = teams[i].schoolID;
            temp["leagueID"] = teams[i].leagueID;
            temp["managerID"] = null; // TODO Add managers to database
            temp["coachID"] = null; // TODO Add coaches to database
            temp["playerIDs"] = [];

            let teamPlayers = players.filter(p => p.teamID == teams[i].ID);
            for (var j in teamPlayers) temp.playerIDs.push(teamPlayers[j].id);

            if (temp.playerIDs.length == 0) temp.players = null;
        }

        res.push(temp)
    }

    return res;
}

exports.getSchools = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();

    for (var i in schools) {
        let temp = {
            id: schools[i].ID,
            name: schools[i].name,
            teamName: schools[i].teamName,
            abbrev: schools[i].abbrev,
            logo: schools[i].logo,
            socials: {
                instagram: schools[i].igURL,
                twitter: schools[i].twitterURL,
                twitch: schools[i].twitchURL,
            }
        }

        if (allinfo) {
            temp["teams"] = [];
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID);
            for (var j in schoolTeams) temp["teams"].push({
                id: teams.filter(t => t.ID == schoolTeams[j].ID)[0].ID,
                league: leagues.filter(l => l.ID == schoolTeams[j].leagueID)[0].title,
                manager: null,
                coach: null,
                players: null,
            });
            if (temp["teams"].length == 0) temp["teams"] = null;
        }
        else {
            temp["teamIDs"] = [];
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID);
            for (var j in schoolTeams) temp["teamIDs"].push(schoolTeams[j].ID);
            if (temp["teamIDs"].length == 0) temp["teamIDs"] = null;
        }

        res.push(temp)
    }
    
    return res;
}

exports.getLeagues = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();

    for (var i in leagues) {
        let temp = {
            id: leagues[i].ID,
            name: leagues[i].title,
        }

        if (allinfo) {
            temp["teams"] = [];
            let schoolTeams = teams.filter(d => d.leagueID == leagues[i].ID);
            for (var j in schoolTeams) temp["teams"].push({
                id: teams.filter(d => d.ID == schoolTeams[j].ID)[0].ID,
                school: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].name,
                teamName: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].teamName,
                abbrev: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].abbrev,
                manager: null,
                coach: null,
                players: null,
            });
            if (temp["teams"].length == 0) temp["teams"] = null;
        }
        else {
            temp["teamIDs"] = [];
            let schoolTeams = teams.filter(d => d.leagueID == leagues[i].ID);
            for (var j in schoolTeams) temp["teamIDs"].push(schoolTeams[j].ID);
            if (temp["teamIDs"].length == 0) temp["teamIDs"] = null;
        }

        res.push(temp)
    }
    
    return res;
}

exports.getPlayers = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let players = await DB.getPlayers();

    for (var i in players) {
        let joinDate = new Date(Date.parse(players[i].joinDate));
        var leaveDate;

        if (players[i].leaveDate == null) leaveDate = null;
        else leaveDate = new Date(Date.parse(players[i].leaveDate)).toDateString();

        let temp = {
            id: players[i].id,
            firstName: players[i].firstName,
            lastName: players[i].lastName,
            IGN: players[i].IGN,
            accountID: players[i].accountID,
            role: players[i].role,
            type: players[i].type,
            joinDate: joinDate.toDateString(),
            leaveDate: leaveDate
        }

        if (allinfo) {
            let school = schools.filter(s => s.ID == teams.filter(t => t.ID == players[i].teamID)[0].schoolID)[0];
            temp["team"] = {
                id: players[i].teamID,
                school: school.name,
                teamName: school.teamName,
                abbrev: school.abbrev,
                manager: null,
                coach: null,
                players: null,
            };
        }
        else temp["teamID"] = players[i].teamID;

        res.push(temp)
    }
    
    return res;
}

exports.getStandings = async (allinfo = false) => {
    let res = {}, scores = [], temp1 = [], temp2 = {};

    let teams = await DB.getTeams();
    let leagues = await DB.getLeagues();
    let schools = await DB.getSchools();
    let schedule = await DB.getSchedule();

    for (var i in leagues) res[leagues[i].ID] = [];


    for (var i in schedule) if (schedule[i].Team1_score != null && schedule[i].Team2_score != null) {
        if (schedule[i].Team1_score < schedule[i].Team2_score) temp1.push([schedule[i].teamID2, schedule[i].teamID1, schedule[i].leagueID]);
        else temp1.push([schedule[i].teamID1, schedule[i].teamID2, schedule[i].leagueID]);
    }

    for (var i in temp1) {
        if (!(temp1[i][0] in temp2)) temp2[temp1[i][0]] = { wins: 0, loss: 0, league: temp1[i][2] };
        if (!(temp1[i][1] in temp2)) temp2[temp1[i][1]] = { wins: 0, loss: 0, league: temp1[i][2] };

        temp2[temp1[i][0]].wins++;
        temp2[temp1[i][1]].loss++;
    }


    for (var i in temp2) scores.push({ id: i, wins: temp2[i].wins, loss: temp2[i].loss, league: temp2[i].league })

    scores.sort(function (a, b) { return parseFloat(b.loss) - parseFloat(a.loss) });
    scores.sort(function (a, b) { return parseFloat(b.wins) - parseFloat(a.wins) });
    scores.sort(function (a, b) { return parseFloat(a.league) - parseFloat(b.league) });

    for (var i in scores) {
        let data = { teamID: scores[i].id,  wins: scores[i].wins, loss: scores[i].loss };
        if (allinfo) {
            data['logo'] = schools.filter(s => s.ID == teams.filter(t => t.ID == data.teamID)[0].schoolID)[0].logo;
            data['name'] = schools.filter(s => s.ID == teams.filter(t => t.ID == data.teamID)[0].schoolID)[0].teamName;
        }
        res[scores[i].league].push(data);

        if (parseInt(i)+1 == scores.length) return res;
    }
}

exports.getTodayGames = async () => {
    let res = [];

    let today = new Date();
    let schedule = await DB.getSchedule();

    let gamesToNotify = schedule.filter(game => {
        let game_time = new Date(game.date);
        return game_time.getDate() == today.getDate() && game_time.getMonth() == today.getMonth() && game_time.getFullYear() == today.getFullYear();
    });

    gamesToNotify.map(game => { res.push(game) });

    return res;
}


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
    if (scores[body.metaData.team1_ID] == 3 || scores[body.metaData.team2_ID] == 3) return [true, scores];
    // if (scores[body.metaData.team1_ID] > 2 || scores[body.metaData.team2_ID] > 2) return [true, scores];

    return [false, scores];
}