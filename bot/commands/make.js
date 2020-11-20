let prodraft = require('../modules/prodraft');

exports.run = async (client, message, args) => {
    let user = message.author;
    console.log(`[BOT] \n[BOT] > ${user.username} typed the 'make' command.`);

//     let info = await prodraft.makeDraft("TEST1", "TEST2", "TEST3");

//     message.channel.send(`
// **RED**: ${info.red}
// **BLUE**: ${info.blue}
// **SPEC**: ${info.spec}
//     `)

    message.delete();
    prodraft.getDraft("001", "002");

    console.log(`[BOT] > End of command entered by ${user.username}`);
};