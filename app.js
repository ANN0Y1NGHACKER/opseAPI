const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const server = require('http').createServer(app);

var port = 3000;

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World \n');
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require("./routes"));

server.listen(port, function () {
	console.info(`Server listening at port ${port}`);
});