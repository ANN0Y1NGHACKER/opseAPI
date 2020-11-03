const DB = require('./SQL');

exports.getTeams = async (allinfo = false) => {
    let res = [];

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
            socials: {
                instagram: schools.filter(s => s.ID == teams[i].schoolID)[0].igURL,
                twitter: schools.filter(s => s.ID == teams[i].schoolID)[0].twitterURL,
                twitch: schools.filter(s => s.ID == teams[i].schoolID)[0].twitchURL,
            }
        }

        if (allinfo) {
            // TODO All info
        }
        else {
            temp["schoolID"] = teams[i].schoolID
            temp["leagueID"] = teams[i].leagueID
        }

        res.push(temp)
    }

    return res;
}