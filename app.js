require('dotenv-flow').config();
const logger = require('./modules/log');
const config = require('./config').init();
global.CONFIG = config;

logger.init();

if (process.argv[2]) if (process.argv[2] == "ALL") require('./bot/bot');

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
    logger.server(`Server listening on port ${port}`)

    // require('./modules/MatchNotifier');
});