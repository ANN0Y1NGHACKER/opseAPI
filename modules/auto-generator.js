const
    DB = require('./SQL'),
    axios = require('axios'),
    config = require('../config'),
    schedule = require('node-schedule'),
    teamsInfo = require('./teamsInfo.json'),
    leagues = ["hs", "lol", "ow", "rl"],
    league_emojis = {
        lol: "<:LoL:745802103871766601>",
        ow: "<:Overwatch:745802104035213342>",
        rl: "<:RocketLeague:745802104010178630>",
        hs: "<:Hearthstone:745802103947132979>",
    };;

let sendHeadToHead = (game, team1, team2, date) => {
    let week = Math.floor(((date.getDate()-18)+(date.getMonth()+1))/7)+10;
    let short_month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);

    let imgURL = `http://api.opsesports.ca/image-generator/create?game=${game}&line1=${short_month}%20${date.getDate()},%20${date.getFullYear()}&line2=Regular%20Season&line3=Week%20${week}&left_logo=${team1.imgID}&right_logo=${team2.imgID}`;

    axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
        "content": `­\n[PREVIEW](<${imgURL}>) - [DOWNLOAD](<${imgURL}&download=true>) | ${league_emojis[game]} ${team1.emoji} **${team1.name}** vs ${team2.emoji} **${team2.name}**`,
    });
}

let checkGames = async (today) => {
    let games = await DB.getSchedule();

    let gamesToNotify = games.filter(game => {
        let game_time = new Date(game.date);
        return game_time.getDate() == today.getDate() && game_time.getMonth() == today.getMonth() && game_time.getFullYear() == today.getFullYear();
    })

    if (gamesToNotify.length > 0) {
        axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
            "content": `Head to Head for tonight's games`,
        }).then(() => {
            gamesToNotify.forEach(game => {
                let team1 = teamsInfo.filter(t => t.id == game.teamID1)[0];
                let team2 = teamsInfo.filter(t => t.id == game.teamID2)[0];
                let gameN = leagues[game.leagueID-1];
        
                sendHeadToHead(gameN, team1, team2, today);
            });
        });
    }
}

schedule.scheduleJob('00 11 * * *', checkGames);