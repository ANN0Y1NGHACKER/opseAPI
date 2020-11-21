const opseAPI = require('../../modules/API');
const Discord = require('discord.js');

const emojis = {
    101: "<:Warriors:745741444135780512>",
    102: "<:Ravens:745738497134035046>",
    103: "<:Falcons:745740040629387307>",
    104: "<:Saints:745739525015208026>",
    105: "<:Rams:746896601477545984>",
    106: "<:GeeGees:755209490336579684>",
    107: "<:Lions:753264967473692904>",

    201: "<:Ravens:745738497134035046>",
    202: "<:Condors:745739767747969116>",
    203: "<:Falcons:745740040629387307>",
    204: "<:Gaels:745739271004094465>",
    205: "<:Saints:745739525015208026>",
    206: "<:Excalibur:745741458660655224>",
    207: "<:GeeGees:755209490336579684>",
    208: "<:UofT:753346089330933833>",
    209: "<:Warriors:745741444135780512>",
    210: "<:Lancers:745741425466933398>",
    211: "<:Mustangs:747952935878787172>",
    212: "<:Lions:753264967473692904>",

    301: "<:Ravens:745738497134035046>",
    302: "<:Condors:745739767747969116>",
    303: "<:Falcons:745740040629387307>",
    304: "<:Gaels:745739271004094465>",
    305: "<:Rams:746896601477545984>",
    306: "<:Warriors:745741444135780512>",
    307: "<:Lions:753264967473692904>",

    401: "<:Ravens:745738497134035046>",
    402: "<:CU:745738496790233210>",
    403: "<:Condors:745739767747969116>",
    404: "<:Falcons:745740040629387307>",
    405: "<:LionsEsports:753264968278999064>",
    406: "<:Gaels:745739271004094465>",
    407: "<:Rams:746896601477545984>",
    408: "<:Cougars:745740453030264833>",
    409: "<:Excalibur:745741458660655224>",
    410: "<:GeeGees:755209490336579684>",
    411: "<:UofT:753346089330933833>",
    412: "<:Warriors:745741444135780512>",
    413: "<:Lions:753264967473692904>",
}

/*
 * <:UofT:753346089330933833>
 * <:Warriors:745741444135780512>
 * <:Saints:745739525015208026>
 * <:Ravens:745738497134035046>
 * <:Rams:746896601477545984>
 * <:Mustangs:747952935878787172>
 * <:LionsEsports:753264968278999064>
 * <:Lions:753264967473692904>
 * <:Lancers:745741425466933398>
 * <:GeeGees:755209490336579684>
 * <:Gaels:745739271004094465>
 * <:Falcons:745740040629387307>
 * <:Excalibur:745741458660655224>
 * <:CU:745738496790233210>
 * <:Cougars:745740453030264833>
 * <:Condors:745739767747969116>
 * 
 * 
 * 101 - Waterloo Warriors
 * 102 - Carleton Ravens
 * 103 - Fanshawe Falcons
 * 104 - St. Clair Saints
 * 105 - Ryerson Rams
 * 106 - uOttawa Gee-Gees Esports
 * 107 - York Lions
 *
 * 201 - Carleton Ravens
 * 202 - Conestoga Condors
 * 203 - Fanshawe Falcons
 * 204 - Queen's Gaels
 * 205 - St. Clair Saints
 * 206 - Trent Excalibur
 * 207 - uOttawa Gee-Gees Esports
 * 208 - University of Toronto Sports & Rec Esports
 * 209 - Waterloo Warriors
 * 210 - Lancer Gaming
 * 211 - Western Mustangs Esports
 * 212 - York Lions
 *
 * 301 - Carleton Ravens
 * 302 - Conestoga Condors
 * 303 - Fanshawe Falcons
 * 304 - Queen's Gaels
 * 305 - Ryerson Rams
 * 306 - Waterloo Warriors
 * 307 - York Lions
 *
 * 401 - Carleton Ravens
 * 402 - Concordia Esports
 * 403 - Conestoga Condors
 * 404 - Fanshawe Falcons
 * 405 - Lambton Lions Esports
 * 406 - Queen's Gaels
 * 407 - Ryerson Rams
 * 408 - Sault Cougars
 * 409 - Trent Excalibur
 * 410 - uOttawa Gee-Gees Esports
 * 411 - University of Toronto Sports & Rec Esports
 * 412 - Waterloo Warriors
 * 413 - York Lions
 *
 */

let sendEmbed = async (channel, data, title, logo) => {
    const icons = {
        hs_icon: {
            attach: new Discord.MessageAttachment(`./bot/assets/hs_icon.png`),
            url: "attachment://hs_icon.png"
        },
        lol_icon: {
            attach: new Discord.MessageAttachment(`./bot/assets/lol_icon.png`),
            url: "attachment://lol_icon.png"
        },
        ow_icon: {
            attach: new Discord.MessageAttachment(`./bot/assets/ow_icon.png`),
            url: "attachment://ow_icon.png"
        },
        rl_icon: {
            attach: new Discord.MessageAttachment(`./bot/assets/rl_icon.png`),
            url: "attachment://rl_icon.png"
        }
    }

    let embed = {
        "title": title,
        "description": "",
        "color": 14100527,
        "timestamp": new Date(),
        "thumbnail": {
            "url": icons[logo].url
        }
    }

    await data.sort(function (a, b) { return parseFloat(a.loss) - parseFloat(b.loss) });
    await data.sort(function (a, b) { return parseFloat(b.wins) - parseFloat(a.wins) });
    
    for (var i in data) {
        n = parseInt(i) + 1;
        if (n<10) n = `0${n}`
        embed.description += `\`${n}\` - \`${data[i].wins}W ${data[i].loss}L\` - ${emojis[data[i].teamID]} ${data[i].name}\n`;
    }
    
    channel.send({ files: [icons[logo].attach], embed: embed });
}

exports.run = async (client, message, args) => {
    let user = message.author;

    console.log(`[BOT] \n[BOT] > ${user.username} typed the 'standings' command.`);
    let standings = await opseAPI.getStandings(true);

    if (args[0]) {
        switch (args[0]) {
            case "1":
            case "hs":
                sendEmbed(message.channel, standings["1"], "Hearthstone Standings", "hs_icon");
                console.log(`[BOT]     - I displaying Hearthstone stats.`);
                break;

            case "2":
            case "lol":
                sendEmbed(message.channel, standings["2"], "League of Legends Standings", "lol_icon");
                console.log(`[BOT]     - I displaying League of Legends stats.`);
                break;


            case "3":
            case "ow":
                sendEmbed(message.channel, standings["3"], "Overwatch Standings", "ow_icon");
                console.log(`[BOT]     - I displaying Overwatch stats.`);
                break;


            case "4":
            case "rl":
                sendEmbed(message.channel, standings["4"], "Rocket League Standings", "rl_icon");
                console.log(`[BOT]     - I displaying Rocket League stats.`);
                break;
        
            default:
                break;
        }
    }
    else {
        console.log(`[BOT]     - I displaying ALL stats.`);
        sendEmbed(message.channel, standings["1"], "Hearthstone Standings", "hs_icon");
        sendEmbed(message.channel, standings["2"], "League of Legends Standings", "lol_icon");
        sendEmbed(message.channel, standings["3"], "Overwatch Standings", "ow_icon");
        sendEmbed(message.channel, standings["4"], "Rocket League Standings", "rl_icon");
    }

    console.log(`[BOT] > End of command entered by ${user.username}`);
};