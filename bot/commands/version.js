const logger = require('../../modules/log');
const console = new logger("BOT", "cyan");

exports.run = (client, message, args) => {
    let userName = message.author.username
    let userID = message.author.id;
    console.log(` `);
    console.log(`> ${userName} typed the 'version' command.`);

    message.channel.send(`
Bot running version: \`1.0.3\`.
Last update:
\`\`\`
Fixed week no. for auto Head to Head
Discord message now displays game as well
  - Taimoor Tariq
\`\`\`
`);
    console.log(`    - Posted msg in channel.`);

    console.log(`> End of command entered by ${userName}`);
};