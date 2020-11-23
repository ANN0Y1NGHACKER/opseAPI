const bot = global.DISCORD_BOT;

exports.sendMessage = (channel, msg) => {bot.channels.cache.get(channel).send(msg)};