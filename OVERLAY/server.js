const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const server = require('http').createServer(app);

var port = process.env.PORT2 || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("./routes"));

server.listen(port, () => {console.info(`OVERLAY Server listening on port ${port}`)});