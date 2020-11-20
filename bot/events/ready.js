module.exports = async client => {
	console.log(`[BOT]  \n[BOT] Logged in as ${client.user.tag}!`);

	client.user.setStatus('invisible');
	// client.user.setActivity("temporary Commands", { type: "listening"});

	var rMa = [
		// ["649150418106056704", "649158504762048532"]
	];

	for (var i in rMa) {
		await client.channels.get(rMa[i][0]).fetchMessage(rMa[i][1]);
		if (client.channels.get(rMa[i][0]).messages.has(rMa[i][1])) {
			console.log(`[BOT] Message ${parseInt(i)+1} Cached!`);
		}
	}
};
