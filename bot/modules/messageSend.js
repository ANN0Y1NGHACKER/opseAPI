const bot = global.DISCORD_BOT;

exports.channel = (id) => {
    let cChannel = bot.channels.cache.get(id);
    return {
        send: (msg) => { cChannel.send(msg) }
    };
}