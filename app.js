require('dotenv-flow').config();
const config = require('./config').init();
global.CONFIG = config;

const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const server = require('http').createServer(app);

var port = config.PORT || 3000;

require('./bot/index');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("./routes"));

server.listen(port, () => {console.info(`[API] Server listening on port ${port}`)});