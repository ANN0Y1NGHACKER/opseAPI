const schedule = require('node-schedule');
const DB = require('./SQL');
const discord = require('../bot/modules/messageSend');

const logger = require('../modules/log');
const console = new logger("MATCH NOTIFIER");

const teamChannels = require('../bot/teamChannels.json');

schedule.scheduleJob('00 * * * * *', async () => {
    let games = await DB.getSchedule();
    let cTime = new Date();
    cTime.setSeconds(0,0);

    let gamesToNotify = [];

    for (var i in games) {
        let gTime = new Date(games[i].date);
        // gTime.setHours(gTime.getHours() - 2);
        gTime.setMinutes(gTime.getMinutes() - 2);

        if (gTime.getTime() == cTime.getTime()) gamesToNotify.push(games[i]);
    }

    for (var i in gamesToNotify) {
        let team1 = teamChannels.filter(t => t.id == gamesToNotify[i].teamID1)[0];
        let team2 = teamChannels.filter(t => t.id == gamesToNotify[i].teamID2)[0];

        discord.sendMessage(team1.channel, `You have a game against **${team2.name}** in 2 minutes.`);
        discord.sendMessage(team2.channel, `You have a game against **${team1.name}** in 2 minutes.`);
    }

    if (gamesToNotify.length > 0) console.log(`Notified ${gamesToNotify.length} games.`);
});