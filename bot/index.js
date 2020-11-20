const active = true;

let config = global.CONFIG;
if (process.argv[2]) {
    require('dotenv-flow').config();
    config = require('../config').init();
}

const Discord = require('discord.js');
const fs = require('fs');

if (active) {
    const client = new Discord.Client();
    global.DISCORD_BOT = client;

	console.log(`[BOT] Loading Commands and events:`)
	client.commands = {};

	// Getting Events
	fs.readdir(`${__dirname}/events/`, async (err, files) => {
		if (err) return console.error;
		console.log('[BOT] \n[BOT]   • Events:')
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			const evt = require(`${__dirname}/events/${file}`);
			let evtName = file.split('.')[0];
			console.log(`[BOT]     - Loaded → ${evtName}`);
			client.on(evtName, evt.bind(null, client))
		});
	});

	// Getting Commands
	fs.readdir(`${__dirname}/commands/`, async (err, files) => {
		if (err) return console.error;
		console.log('[BOT] \n[BOT]   • Commands:')
		files.forEach(file => {
			if (!file.endsWith('.js')) return;
			let props = require(`${__dirname}/commands/${file}`);
			let cmdName = file.split('.')[0];
			console.log(`[BOT]     - Loaded → ${cmdName}`);
			client.commands[cmdName] = props;
		});
	});

	client.on('raw', async event => {
		switch(event.t){
			case "MESSAGE_REACTION_REMOVE": {
				const { d: data } = event;
				const user = client.users.get(data.user_id);
				const channel = client.channels.get(data.channel_id) || await user.createDM();
				const message = await channel.fetchMessage(data.message_id);
				const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
				const reaction = message.reactions.get(emojiKey);
		
				client.emit('messageReactionRemove', reaction, user);
				break;
			}
		}
	});

	client.login(config.BOT_TOKEN);
}
else console.log("[BOT] BOT is not active");