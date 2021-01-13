const
    exec = require('util').promisify(require('child_process').exec),
    teamsInfo = require('./modules/teamsInfo.json'),
    // API = require('./modules/API'),
    express = require('express'),
    router = express.Router(),
    axios = require('axios')

router.get("/", (req, res) => {res.end("OPSE API -  v1.0.0")});
router.get("/index.php", (req, res) => {res.end("OPSE API -  v1.0.0")});

router.get('/tourneycode/:meta.:type?', async (req, res) => {
	let requestData = {
        "mapType": "SUMMONERS_RIFT",
        "metadata": req.params.meta,
        "pickType": "TOURNAMENT_DRAFT",
        "spectatorType": "LOBBYONLY",
        "teamSize": 5
	}
	if (req.params.type) if (req.params.type.toLowerCase() == "all") requestData.spectatorType = "ALL";

	axios.post(`https://americas.api.riotgames.com/lol/tournament/v4/codes?count=1&tournamentId=${process.env.RIOT_ID}&api_key=${process.env.RIOT_API}`, requestData).then((body) => {
        res.send(body.data[0]);
    })
    .catch((error) => {
		console.error(error);
		res.send(error);
	})
});

router.post('/git-refresh', async (req, res) => {
    console.log("Pulling from git");
    await exec('git reset --hard HEAD');
    await exec('git pull');
    res.end("Server in sync with git");
    console.log("Pulled from git");
});

router.post('/lolMatchResult', async (req, res) => {
	let finalmeta = {
		team1_ID: "",
        team2_ID: "",
        matchID: "",
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

		axios.post(`https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`, {
            "content": `
\`\`\`js
{
    "tournamentcode": "${body.shortCode}",
    "riot-gameID": "${body.gameId}",
    "metadata": {
		team1_ID: "${body.metaData.team1_ID}",
        team2_ID: "${body.metaData.team2_ID}",
        matchID: "${body.metaData.matchID}",
		description:"${body.metaData.description}"
	},
}
\`\`\`
            `
		});

	// let winning_team = "";
	
	// for (var i in body.winningTeam) {
	// 	let found = await API.checkPlayer(body.winningTeam[i].summonerName);
	// 	if (found[0]) {
	// 		winning_team = found[1];
	// 		break;
	// 	}
	// }
	
	// body.metaData["win_ID"] = winning_team;

	// let isOver = await API.saveGame(body);
	// let date = new Date();
	// if (!isOver[0]) {
	// 	axios.post(`https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`, {
	// 		"content": `**[Click here](http://api.opsesports.ca/createImg-wide?game=lol&l_score=${isOver[1][body.metaData.team1_ID]}&r_score=${isOver[1][body.metaData.team2_ID]}&line1=LIVE%20NOW&line2=Regular%20Season&line3=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&left=${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].imgID}&download=true)** to download`
	// 	});
	// }
	// else {
	// 	axios.post(`https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`, {
	// 		"content": `**[Click here](http://api.opsesports.ca/createImg-wide?game=lol&l_score=${isOver[1][body.metaData.team1_ID]}&r_score=${isOver[1][body.metaData.team2_ID]}&line1=FINAL%20SCORE&line2=Regular%20Season&line3=${new Intl.DateTimeFormat('en', { month: 'short' }).format(date)}%20${date.getDate()},%20${date.getFullYear()}&crown=true&left=${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].imgID}&download=true)** to download`
	// 	});
	// }

	res.send("LOGGED!!!");
});

module.exports = router;