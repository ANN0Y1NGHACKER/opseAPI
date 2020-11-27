const fs = require('fs');
const colors = require('colors');
const logPath = `./app.log`;

let getTime = () => {
    let time = new Date();
    let h = parseInt(time.getHours());
    let m = parseInt(time.getMinutes());
    let dd = parseInt(time.getDate());
    let mm = parseInt(time.getMonth());
    let yy = parseInt(time.getFullYear());

    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${h}`;
    if (dd < 10) dd = `0${h}`;
    if (mm < 10) mm = `0${h}`;

    return `${dd}-${mm}-${yy} ${h}:${m}`;
}

module.exports = class Logger {
    constructor(prefix="LOG", color="green") {
        this.pre_text = prefix;
        this.pre_color = color;
    }

    log(msg) {
        console.log(`${colors.white('[')}${colors[this.pre_color](this.pre_text)}${colors.white(']')} ${colors.white(msg)}`);
        fs.appendFile(logPath, `[${getTime()}][${this.pre_text}] ${msg}\n`, (err) => { if (err) throw err });
    }

    info(msg) {
        console.log(`${colors.white('[')}${colors[this.pre_color](this.pre_text)}${colors.white(']')} ${colors.green(msg)}`);
        fs.appendFile(logPath, `[${getTime()}][${this.pre_text}] ${msg}\n`, (err) => { if (err) throw err });
    }

    warn(msg) {
        console.log(`${colors.white('[')}${colors[this.pre_color](this.pre_text)}${colors.white(']')} ${colors.yellow(msg)}`);
        fs.appendFile(logPath, `[${getTime()}][${this.pre_text}] ${msg}\n`, (err) => { if (err) throw err });
    }

    error(msg) {
        console.log(`${colors.white('[')}${colors[this.pre_color](this.pre_text)}${colors.white(']')} ${colors.red(msg)}`);
        fs.appendFile(logPath, `[${getTime()}][${this.pre_text}] ${msg}\n`, (err) => { if (err) throw err });
    }
}