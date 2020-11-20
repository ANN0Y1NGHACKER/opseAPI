exports.run = (client, message, args) => {
    let userName = message.author.username
    let userID = message.author.id;
    console.log(`[BOT] \n[BOT] > ${userName} typed the 'hi' command.`);

    message.channel.send(`Hi <@${userID}>, hope you are having a good time.`)
    console.log(`[BOT]     - I said hi to ${userName}.`);

    console.log(`[BOT] > End of command entered by ${userName}`);
};