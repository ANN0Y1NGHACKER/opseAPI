const fs = require('fs');
const colors = require('colors');
const logPath = `./app.log`;

let getTime = () => {
    let time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    let dd = time.getDate();
    let mm = time.getMonth();
    let yy = time.getFullYear();

    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${h}`;
    if (dd < 10) dd = `0${h}`;
    if (mm < 10) mm = `0${h}`;

    return `${dd}-${mm}-${yy} ${h}:${m}`;
}

exports.init = async () => {
    if (!fs.existsSync(logPath)) fs.writeFile(logPath, "", (err) => { if (err) throw err });
    else fs.appendFile(logPath, `\nNew Session Started\n`, (err) => { if (err) throw err });
}

exports.server = (msg) => {
    console.log(`${colors.white('[')}${colors.yellow('SERVER')}${colors.white(']')} ${colors.white(msg)}`);
    fs.appendFile(logPath, `[${getTime()}][SERVER] ${msg}\n`, (err) => { if (err) throw err });
}

exports.bot = (msg) => {
    console.log(`${colors.white('[')}${colors.cyan('BOT')}${colors.white(']')} ${colors.white(msg)}`);
    fs.appendFile(logPath, `[${getTime()}][BOT] ${msg}\n`, (err) => { if (err) throw err });
}