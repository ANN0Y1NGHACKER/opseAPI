let config = global.CONFIG;
if (process.argv[2]) if (process.argv[2] == "BOT") {
    require('dotenv-flow').config();
    config = require('../config').init();
}

const logger = require('../modules/log');
const console = new logger("bot");
const Discord = require('discord.js');
const fs = require('fs');


const client = new Discord.Client();
global.DISCORD_BOT = client;

console.log(`Loading Commands and events:`)
client.commands = {};

// Getting Events
fs.readdir(`${__dirname}/events/`, async (err, files) => {
	if (err) return console.error;
	console.log(' ');
	console.log('  • Events:')
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const evt = require(`${__dirname}/events/${file}`);
		let evtName = file.split('.')[0];
		console.log(`    - Loaded → ${evtName}`);
		client.on(evtName, evt.bind(null, client))
	});
});

// Getting Commands
fs.readdir(`${__dirname}/commands/`, async (err, files) => {
	if (err) return console.error;
	console.log('  • Commands:')
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		let props = require(`${__dirname}/commands/${file}`);
		let cmdName = file.split('.')[0];
		console.log(`    - Loaded → ${cmdName}`);
		client.commands[cmdName] = props;
	});
});

client.on('raw', async event => {
	switch(event.t){
		case "MESSAGE_REACTION_REMOVE": {
			const { d: data } = event;
			const user = client.users.cache.get(data.user_id);
			const channel = client.channels.cache.get(data.channel_id) || await user.createDM();
			const message = await channel.messages.fetch(data.message_id);
			const reaction = message.reactions.cache.get(data.emoji.id).emoji;
	
			client.emit('messageReactionRemove', reaction, user);
			break;
		}
	}
});

client.login(config.BOT_TOKEN);