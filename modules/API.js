const DB = require('./SQL');

exports.getTeams = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();

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

            temp["players"] = [] // TODO Add players to database
        }
        else {
            temp["schoolID"] = teams[i].schoolID;
            temp["leagueID"] = teams[i].leagueID;
            temp["managerID"] = null; // TODO Add managers to database
            temp["coachID"] = null; // TODO Add coaches to database
            temp["playerIDs"] = []; // TODO Add players to database
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
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID)
            for (var j in schoolTeams) temp["teams"].push({
                id: teams.filter(t => t.ID == schoolTeams[j].ID)[0].ID,
                league: leagues.filter(l => l.ID == schoolTeams[j].leagueID)[0].title
            });
        }
        else {
            temp["teamIDs"] = [];
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID)
            for (var j in schoolTeams) temp["teamIDs"].push(schoolTeams[j].ID)
        }

        res.push(temp)
    }
    
    return res;
}