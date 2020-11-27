const config = global.CONFIG;
const schedule = require('node-schedule');
const DB = require('./SQL');
const discord = require('../bot/modules/messageSend');
const axios = require('axios');

const logger = require('../modules/log');
const console = new logger("MATCH NOTIFIER");

const teamsInfo = require('../bot/teamsInfo.json');

// schedule.scheduleJob('00 * * * * *', async () => {
//     let games = await DB.getSchedule();
//     let cTime = new Date();
//     cTime.setSeconds(0,0);

//     let gamesToNotify = [];

//     for (var i in games) {
//         let gTime = new Date(games[i].date);
//         // gTime.setHours(gTime.getHours() - 2);
//         gTime.setMinutes(gTime.getMinutes() - 2);

//         if (gTime.getTime() == cTime.getTime()) gamesToNotify.push(games[i]);
//     }

//     for (var i in gamesToNotify) {
//         let team1 = teamsInfo.filter(t => t.id == gamesToNotify[i].teamID1)[0];
//         let team2 = teamsInfo.filter(t => t.id == gamesToNotify[i].teamID2)[0];

//         discord.sendMessage(team1.channel, `You have a game against **${team2.name}** in 2 minutes.`);
//         discord.sendMessage(team2.channel, `You have a game against **${team1.name}** in 2 minutes.`);
//     }

//     if (gamesToNotify.length > 0) console.log(`Notified ${gamesToNotify.length} games.`);
// });


let sendHeadToHead = (game, team1, team2) => {
    let date = new Date();
    axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
        "content": `­\n[PREVIEW](<http://api.opsesports.ca/createImg-wide?game=${game}&line1=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&line2=Regular%20Season&line3=Week%208&left_logo=${team1.imgID}&right_logo=${team2.imgID}>) - [DOWNLOAD](<http://api.opsesports.ca/createImg-wide?game=${game}&line1=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&line2=Regular%20Season&line3=Week%208&left_logo=${team1.imgID}&right_logo=${team2.imgID}&download=true>) | ${team1.emoji} **${team1.name}** vs ${team2.emoji} **${team2.name}**`
    });
}

schedule.scheduleJob('00 11 * * *', async () => {
    let games = await DB.getSchedule();
    let cTime = new Date();
    cTime.setSeconds(0,0);

    let gamesToNotify = [];

    for (var i in games) {
        let gTime = new Date(games[i].date);

        if (
            gTime.getDate() == cTime.getDate() &&
            gTime.getMonth() == cTime.getMonth() &&
            gTime.getFullYear() == cTime.getFullYear()
        ) gamesToNotify.push(games[i]);
    }

    if (gamesToNotify.length > 0) {
        axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
            "content": `Head to Head for tonight's games`
        }).then(() => {
            for (var i in gamesToNotify) {
                let team1 = teamsInfo.filter(t => t.id == gamesToNotify[i].teamID1)[0];
                let team2 = teamsInfo.filter(t => t.id == gamesToNotify[i].teamID2)[0];
        
                let game = "hs";
        
                switch (gamesToNotify[i].leagueID) {
                    case 1:
                        game = "hs";
                        break;
        
                    case 2:
                        game = "lol";
                        break;
        
                    case 3:
                        game = "ow";
                        break;
        
                    case 4:
                        game = "rl";
                        break;
                
                    default:
                        break;
                }
        
                sendHeadToHead(game, team1, team2);
            }            
        })
    }
});