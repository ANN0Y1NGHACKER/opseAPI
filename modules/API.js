const DB = require('./SQL');

exports.getTeams = async (allinfo = false) => {
    let res = [];
    global.db.connect();

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();

    // console.log(schools.filter(s => s.ID == 14))
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
        }
        else {
            temp["schoolID"] = teams[i].schoolID;
            temp["leagueID"] = teams[i].leagueID;
        }

        res.push(temp)
    }

    global.db.end();
    return res;
}