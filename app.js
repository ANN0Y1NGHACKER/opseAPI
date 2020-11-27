require('dotenv-flow').config();

const fs = require('fs');
if (!fs.existsSync("./app.log")) fs.writeFile("./app.log", "", (err) => { if (err) throw err });
else fs.appendFile("./app.log", `\nNew Session Started\n`, (err) => { if (err) throw err });

const logger = require('./modules/log');
const console = new logger("SERVER");

const config = require('./config').init();
global.CONFIG = config;

const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const server = require('http').createServer(app);

var port = config.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("./routes"));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    if (process.argv[2]) if (process.argv[2] == "ALL") require('./bot/bot');
    // require('./modules/MatchNotifier');
});