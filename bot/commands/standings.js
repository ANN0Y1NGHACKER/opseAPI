const request = require('request-promise');

let sendEmbed = (channel, data) => {

}

exports.run = (client, message, args) => {
    let user = message.author;

    console.log(`[BOT] \n[BOT] > ${user.username} typed the 'standings' command.`);

    if (args[0]) {
        switch (args[0]) {
            case value:
                
                break;
        
            default:
                break;
        }
    }

    console.log(`[BOT] > End of command entered by ${user.username}`);
};