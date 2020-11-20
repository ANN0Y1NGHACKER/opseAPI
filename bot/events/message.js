const prefix = process.env.BOT_PREFIX;

module.exports = async (client, message) => {
	if (message.author.bot) return;

	if (message.content.indexOf(prefix) !== 0) return;

	args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLocaleLowerCase();

	const cmd = client.commands[command];
	if (!cmd) return;

    cmd.run(client, message, args);
}