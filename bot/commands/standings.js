const request = require('request-promise');

let sendEmbed = (channel, data, filtered=false) => {
    let embed = {
        "title": "",
        "description": "",
        "color": 14100527,
        "timestamp": new Date(),
        "thumbnail": {
            "url": "https://cdn.discordapp.com/embed/avatars/0.png"
        }
    }

    if (filtered) for (var i in data) {
        n = parseInt(i)+1;
        if (n<10) n = `0${n}`
        embed.description += `\`${n}\` - **${data[i].wins}W ${data[i].loss}L** - ${data[i].name}\n`;
    }

    channel.send({ embed });
}

exports.run = (client, message, args) => {
    let user = message.author;

    console.log(`[BOT] \n[BOT] > ${user.username} typed the 'standings' command.`);

    if (args[0]) {
        switch (args[0]) {
            case "1":
            case "lol":
                request("http://api.opsesports.ca/standings/1").then(body => {
                    sendEmbed(message.channel, JSON.parse(body), true)
                });
                break;
        
            default:
                break;
        }
    }

    console.log(`[BOT] > End of command entered by ${user.username}`);
};