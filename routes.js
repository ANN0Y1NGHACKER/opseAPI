const config = global.CONFIG;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require("express");
const axios = require('axios');
const router = express.Router();
const jimp = require('jimp');
const urlparse = require('url-parse');

const API = require('./modules/API');
const prodraft = require('./bot/modules/prodraft');
const bot = global.DISCORD_BOT;
const teamChannels = require('./bot/teamChannels.json');
const logger = require('./modules/log');

let prodraftGames = ["199"];

let wsUsers = JSON.parse(config.WS_USERS);

let sendJSON = (res, data, filter=[]) => {
	if (filter.length != 0) {
		newData = [];
		for (var i in filter[1]) {
			if (newData.length == 0) newData = data.filter(d => d[filter[1][i]] == filter[0]);
			else break;
		}
		data = newData;
	}

	res.header("Content-Type",'application/json');
	res.send(JSON.stringify(data, null, 4));
};

router.get("/", (req, res) => {res.sendFile(`${__dirname}/views/index.html`)});
router.get("/index.php", (req, res) => {res.sendFile(`${__dirname}/views/index.html`)});
router.get("/image-generator", (req, res) => {res.sendFile(`${__dirname}/ImageGen/index.html`)});

router.get("/createImg-wide", async (req, res) => {
	const line1 = await jimp.loadFont("./ImageGen/fonts/line1.fnt");
	const line2 = await jimp.loadFont("./ImageGen/fonts/line2.fnt");
	const line3 = await jimp.loadFont("./ImageGen/fonts/line3.fnt");

	const queryObject = urlparse(req.url,true).query;
	let images = [];

	let ls = 0, rs = 0;

	for (var i in queryObject) {
		switch (i) {
			case "game":
				images.push(`./ImageGen/base/${queryObject[i]}.png`);
				break;

			case "l_score":
				images.push(`./ImageGen/${queryObject[i]}L.png`);
				ls = queryObject[i];
				break;
		
			case "r_score":
				images.push(`./ImageGen/${queryObject[i]}R.png`);
				rs = queryObject[i];
				break;

			default:
				break;
		}
	}

	if ("crown" in queryObject) {
		if (queryObject["crown"] == "true") {
			if (ls < rs) images.push(`./ImageGen/crownr.png`);
			else if (ls > rs) images.push(`./ImageGen/crownl.png`);
		}
	}

	let jimps = [];

	for (var i = 0; i < images.length; i++) {
		jimps.push(jimp.read(images[i]).catch((e) => {}));
	};

	Promise.all(jimps).then(() => {
		return Promise.all(jimps);
	}).then(async (data) => {
		for (var i=1; i<data.length; i++) data[0].composite(data[i], 0, 0);

		for (var i in queryObject) {
			switch (i) {
				case "line1":
					data[0].print(line1, 0, 158, {
						text: queryObject[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
					break;
	
				case "line2":
					data[0].print(line2, 14, 880, {
						text: queryObject[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
					break;
			
				case "line3":
					data[0].print(line3, 20, 950, {
						text: queryObject[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
					break;

				case "left":
					let logoIMGl_wn = await jimp.read(`./ImageGen/logos/withName/${queryObject[i]}.png`).catch((e) => {});
					try {
						logoIMGl_wn.resize(jimp.AUTO, 120)
						data[0].composite(logoIMGl_wn, 280, 620);	
					} catch (e) {};
					break;

				case "right":
					let logoIMGr_wn = await jimp.read(`./ImageGen/logos/withName/${queryObject[i]}.png`).catch((e) => {});
					try {
						logoIMGr_wn.resize(jimp.AUTO, 120)
						data[0].composite(logoIMGr_wn, 1030, 620);
					} catch (e) {};
					break;

				case "left_logo":
					let logoIMGl = await jimp.read(`./ImageGen/logos/${queryObject[i]}.png`).catch((e) => {});
					try {
						logoIMGl.resize(jimp.AUTO, 450)
						data[0].composite(logoIMGl, 400, 300);	
					} catch (e) {};
					break;

				case "right_logo":
					let logoIMGr = await jimp.read(`./ImageGen/logos/${queryObject[i]}.png`).catch((e) => {});
					try {
						logoIMGr.resize(jimp.AUTO, 450)
						data[0].composite(logoIMGr, 1070, 300);	
					} catch (e) {};
					break;
	
				default:
					break;
			}
		}
		

		data[0].write(`./public/post.png`, () => {
			if ("download" in queryObject) { if (queryObject["download"] == "true") return res.download(`${__dirname}/public/post.png`) }
			res.sendFile(`${__dirname}/public/post.png`);
		});
	});
});


router.get('/teams/:id?.:min?', async (req, res) => {
	let data = await API.getTeams(true);
	if (req.params.min == "min") data = await API.getTeams();
	if (req.params.id) sendJSON(res, data, [req.params.id, ["id", "abbrev"]]);
	else sendJSON(res, data);
});

router.get('/schools/:id?.:min?', async (req, res) => {
	let data = await API.getSchools(true);
	if (req.params.min == "min") data = await API.getSchools();
	if (req.params.id) sendJSON(res, data, [req.params.id, ["id", "abbrev"]]);
	else sendJSON(res, data);
});

router.get('/leagues/:id?.:min?', async (req, res) => {
	let data = await API.getLeagues(true);
	if (req.params.min == "min") data = await API.getLeagues();
	if (req.params.id) sendJSON(res, data, [req.params.id, ["id", "name"]]);
	else sendJSON(res, data);
});

router.get('/players/:id?.:min?', async (req, res) => {
	let data = await API.getPlayers();
	if (req.params.id) data = await API.getPlayers(true);
	if (req.params.min == "min") data = await API.getPlayers();
	if (req.params.id) sendJSON(res, data, [req.params.id, ["id"]]);
	else sendJSON(res, data);
});

router.get('/standings/:id?.:min?', async (req, res) => {
	let data = await API.getStandings(true);
	if (req.params.min == "min") data = await API.getStandings();
	if (req.params.id) sendJSON(res, data[req.params.id]);
	else sendJSON(res, data);
});


router.get('/tourneycode/:meta.:type?', async (req, res) => {
	let requestData = {
        "mapType": "SUMMONERS_RIFT",
        "metadata": req.params.meta,
        "pickType": "TOURNAMENT_DRAFT",
        "spectatorType": "LOBBYONLY",
        "teamSize": 5
	}
	if (req.params.type) if (req.params.type.toLowerCase() == "all") requestData.spectatorType = "ALL";

	axios.post(`https://americas.api.riotgames.com/lol/tournament/v4/codes?count=1&tournamentId=${config.RIOT_ID}&api_key=${config.RIOT_API}`, requestData).then((body) => {
        res.send(body.data[0]);
    })
    .catch((error) => {
		console.error(error);
		res.send(error);
	})
});

router.post('/lolMatchResult', async (req, res) => {
	logger.server("here")
	let finalmeta = {
		team1_ID: "",
		team2_ID: "",
		description:""
	}
	let body = req.body;
	let meta = body.metaData.split(" ");

	finalmeta.team1_ID = meta[0];
	meta.shift();
	finalmeta.team2_ID = meta[0];
	meta.shift();
	finalmeta.matchID = meta[0];
	meta.shift();
	finalmeta.description = meta.join(" ");
	body.metaData = finalmeta;

	let winning_team = "";
	
	for (var i in body.winningTeam) {
		let found = await API.checkPlayer(body.winningTeam[i].summonerName);
		if (found[0]) {
			winning_team = found[1];
			break;
		}
	}
	
	body.metaData["win_ID"] = winning_team;

	logger.server(body)

	let isOver = await API.saveGame(body);
	let date = new Date();
	if (!isOver[0]) {
		axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
			"content": `**[Click here](http://api.opsesports.ca/createImg-wide?game=lol&l_score=${isOver[1][body.metaData.team1_ID]}&r_score=${isOver[1][body.metaData.team2_ID]}&line1=LIVE%20NOW&line2=Regular%20Season&line3=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&left=${teamChannels.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamChannels.filter(t => t.id == body.metaData.team2_ID)[0].imgID}&download=true)** to download`
		});

		if (prodraftGames.includes(body.metaData.matchID)) {
			if (body.metaData.win_ID == body.metaData.team1_ID) prodraft.sendDraft(body.metaData.team1_ID, body.metaData.team2_ID);
			else if (body.metaData.win_ID == body.metaData.team2_ID) prodraft.sendDraft(body.metaData.team2_ID, body.metaData.team1_ID);
		}
	}
	else {
		axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
			"content": `**[Click here](http://api.opsesports.ca/createImg-wide?game=lol&l_score=${isOver[1][body.metaData.team1_ID]}&r_score=${isOver[1][body.metaData.team2_ID]}&line1=FINAL%20SCORE&line2=Regular%20Season&line3=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&crown=true&left=${teamChannels.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamChannels.filter(t => t.id == body.metaData.team2_ID)[0].imgID}&download=true)** to download`
		});

		if (prodraftGames.includes(body.metaData.matchID)) {
			if (body.metaData.win_ID == body.metaData.team1_ID) prodraft.finalSend(body.metaData.team1_ID, body.metaData.team2_ID, `${isOver[1][body.metaData.team1_ID]} - ${isOver[1][body.metaData.team2_ID]}`);
			else if (body.metaData.win_ID == body.metaData.team2_ID) prodraft.finalSend(body.metaData.team2_ID, body.metaData.team1_ID, `${isOver[1][body.metaData.team2_ID]} - ${isOver[1][body.metaData.team1_ID]}`);
		}
	}

	res.send("LOGGED!!!");
});

router.post("/git-pull", async (req, res) => {
	if (req.body.head_commit.committer.name) {
		if (wsUsers.includes(req.body.head_commit.committer.name)) {
			console.log("Pulling from git");
			await exec('git reset --hard HEAD');
			await exec('git pull');
			res.send("Server in sync with git");
			console.log("Pulled from git");
		}
		else {
			console.log("Not allowed to pull");
			res.status(403).send("Not Allowed");
		}
	}
	else {
		console.log("Not allowed to pull");
		res.status(404).send("Not Found");
	}
});

router.post("/exit", (req, res) => {
	if (req.headers.pass) {
		if (req.headers.pass == process.env.STOP_PASS) process.exit(1);
		else res.status(403).send("Incorrect passcode");
	}
	else res.status(403).send("Not allowed");
});

module.exports = router;