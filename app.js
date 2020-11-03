const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const server = require('http').createServer(app);

var port = 65300;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("./routes"));

server.listen(port, function () {
	console.info('Server listening at port %d', port);
});