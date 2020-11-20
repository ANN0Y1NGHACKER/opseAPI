const request = require('request-promise');

exports.makeDraft = async (team1, team2, title="OPSE") => {
    let res = await request.post("http://prodraft.leagueoflegends.com/draft", {
        json: {
            "team1Name": team1,
            "team2Name": team2,
            "matchName": title
        }
    }).then(body => {
        console.log(`[BOT]     - Made prodraft`)
        let info = {
            blue: `http://prodraft.leagueoflegends.com/?draft=${body.id}&auth=${body.auth[0]}`,
            red: `http://prodraft.leagueoflegends.com/?draft=${body.id}&auth=${body.auth[1]}`,
            spec: `http://prodraft.leagueoflegends.com/?draft=${body.id}`
        }

        return info;
    });
    return res;
}