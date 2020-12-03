let prodraft = require('../modules/prodraft');
const config = global.CONFIG;
const logger = require('../../modules/log');
const console = new logger("BOT", "cyan");
const axios = require('axios');

exports.run = async (client, message, args) => {
    let user = message.author;

    if (user.id != "220161488516546561") return;

    console.log(` `);
    console.log(`> ${user.username} typed the 'prodraft' command.`);

    if (!args[0]) message.reply("Please provide the 2 teamIDs [AWAY HOME] or provide a tournament code.")
    else {
        if (args[0].startsWith("NA")) {
            await axios.default.get(`https://americas.api.riotgames.com/lol/tournament/v4/codes/${args[0]}?api_key=${config.RIOT_API}`)
            .then(res => {
                let meta = res.data.metaData.split(" ");
                prodraft.firstDraft(meta[0], meta[1]);
                console.log(`    - Sent prodraft selection`);
            });
        }
        else try { prodraft.firstDraft(args[0], args[1]) } catch (e) {}
    }

    console.log(`> End of command entered by ${user.username}`);
};