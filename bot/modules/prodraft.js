const request = require('request-promise');
const teamsInfo = require('../teamChannels.json');
const bot = global.DISCORD_BOT;

exports.makeDraft = async (team1="BLUE TEAM", team2="RED TEAM", title="OPSE") => {
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

let awaitReaction = async (msg, filter) => {
    let reac = await msg.awaitReactions(filter, { max: 1, time: 8.64e7, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.id == "779217859589963786" || reaction.emoji.id == "779217988079058986") return reaction.emoji.name;
        else return awaitReaction(msg, filter);
    })
    .catch(collected => {
        console.log("no selection")
    });

    return reac;
}

exports.getDraft = async (winningTeam, losingTeam) => {
    let winTeam = teamsInfo.filter(t => t.id == winningTeam)[0];
    let loseTeam = teamsInfo.filter(t => t.id == losingTeam)[0];

    if (winTeam == null || loseTeam == null) return;

    let winChannel = bot.channels.cache.get(winTeam.channel);
    let loseChannel = bot.channels.cache.get(loseTeam.channel);

    var m1;

    winChannel.send(`Congrats on winning against **${loseTeam.name}**. Please wait while they a side.`).then(msg => { m1 = msg });

    loseChannel.send(`Looks like you have finished your game. Since you lost, pick a side you want to play next game:`).then(async msg => {
        await msg.react("779217859589963786");
        await msg.react("779217988079058986");

        const filter = (reaction, user) => { return ['779217859589963786', '779217988079058986'].includes(reaction.emoji.id) && user.id != msg.author.id };
        let reaction = await awaitReaction(msg, filter);

        var team1, team2, winBlue=false;

        switch (reaction) {
            case "red":
                m1.delete();
                msg.delete();
                team1 = winTeam.name;
                team2 = loseTeam.name;
                winBlue = true;
                break;

            case "blue":
                m1.delete();
                msg.delete();
                team1 = loseTeam.name;
                team2 = winTeam.name;
                break;
        
            default:
                break;
        }

        let prodraftInfo = await this.makeDraft(team1, team2);
        prodraftInfo["win"] = prodraftInfo.red;
        prodraftInfo["lose"] = prodraftInfo.blue;

        if (winBlue) {
            prodraftInfo["win"] = prodraftInfo.blue;
            prodraftInfo["lose"] = prodraftInfo.red;
        }

        winChannel.send(`
**${loseTeam.name}** has chosen *${reaction}* side.

Here are your prodraft links. Finish them ASAP and wait until \`OPSE Admin\` or \`OPSE Replay\` tell you to start in the lobby.

Main: ${prodraftInfo.win}
Spec: ${prodraftInfo.spec}
        `);

        loseChannel.send(`
You have chosen *${reaction}* side.

Here are your prodraft links. Finish them ASAP and wait until \`OPSE Admin\` or \`OPSE Replay\` tell you to start in the lobby.

Main: ${prodraftInfo.lose}
Spec: ${prodraftInfo.spec}
        `);

    });
}

exports.finalSend = async (winningTeam, losingTeam, finalScore) => {
    let winTeam = teamsInfo.filter(t => t.id == winningTeam)[0];
    let loseTeam = teamsInfo.filter(t => t.id == losingTeam)[0];

    if (winTeam == null || loseTeam == null) return;

    let winChannel = bot.channels.cache.get(winTeam.channel);
    let loseChannel = bot.channels.cache.get(loseTeam.channel);

    winChannel.send(`Congrats on winning your series against **${loseTeam.name}** with a score of ${finalScore}.`);
    loseChannel.send(`You fought well against **${winTeam.name}**. Better luck next time.`);
}