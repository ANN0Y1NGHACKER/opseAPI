const logger = require('../../modules/log');
const console = new logger("BOT", "cyan");

exports.run = (client, message, args) => {
    let userName = message.author.username
    let userID = message.author.id;
    console.log(` `);
    console.log(`> ${userName} typed the 'hi' command.`);

    message.channel.send(`Hi <@${userID}>, hope you are having a good time.`)
    console.log(`    - I said hi to ${userName}.`);

    console.log(`> End of command entered by ${userName}`);
};