module.exports = async (client, msgReaction, user) => {
	try {	
		var emoji = msgReaction.emoji;
		// var member = msgReaction.message.guild.members.find(member => member.id === user.id);
	
		if (user.bot) return;
	} catch (e) {}
};
