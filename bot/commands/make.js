let prodraft = require('../modules/prodraft');

exports.run = async (client, message, args) => {
    let user = message.author;

    if (user.id != "220161488516546561") return;

    console.log(`[BOT] \n[BOT] > ${user.username} typed the 'make' command.`);

//     let info = await prodraft.makeDraft("TEST1", "TEST2", "TEST3");

//     message.channel.send(`
// **RED**: ${info.red}
// **BLUE**: ${info.blue}
// **SPEC**: ${info.spec}
//     `)

    message.delete();
    // prodraft.makeDraft("001", "002");

    let date = new Date();
    console.log(`${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)} ${date.getDate()}, ${date.getFullYear()}`)

    console.log(`[BOT] > End of command entered by ${user.username}`);
};