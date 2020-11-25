exports.init = () => {
    let res = {
        "PORT": process.env.PORT,

        "BOT_TOKEN": process.env.BOT_TOKEN,
        "BOT_PREFIX": process.env.BOT_PREFIX,

        "RIOT_ID": process.env.RIOT_ID,
        "RIOT_API": process.env.RIOT_API,

        "WEBHOOK_ID": process.env.WEBHOOK_ID,
        "WEBHOOK_TOKEN": process.env.WEBHOOK_TOKEN,

        "DB_PORT": process.env.DB_PORT,
        "DB_HOST": process.env.DB_HOST,
        "DB_NAME": process.env.DB_NAME,
        "DB_USER": process.env.DB_USER,
        "DB_PASS": process.env.DB_PASS,

        "WS_USERS": process.env.WS_USERS,
        "STOP_PASS": process.env.STOP_PASS,
    }

    return res;
}