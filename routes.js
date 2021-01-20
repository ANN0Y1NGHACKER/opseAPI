const
    project = require('./package.json'),
    config = require('./config'),
    exec = require('util').promisify(require('child_process').exec),
    teamsInfo = require('./modules/teamsInfo.json'),
    API = require('./modules/API'),
    express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    league_emojis = {
        lol: "<:LoL:745802103871766601>",
        ow: "<:Overwatch:745802104035213342>",
        rl: "<:RocketLeague:745802104010178630>",
        hs: "<:Hearthstone:745802103947132979>",
    };

let sendJSON = (res, data, filter=[]) => {
    if (filter.length != 0) {
        newData = [];
        for (var i in filter[1]) {
            if (newData.length == 0) newData = data.filter(d => d[filter[1][i]] == filter[0]);
            else break;
        }
        data = newData;
    }

    res.json(data);
};

router.get("/", (req, res) => {res.end(`OPSE API -  v${project.version}`)});
router.get("/index.php", (req, res) => {res.end(`OPSE API -  v${project.version}`)});

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

    if ("test" in body) {
        axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
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
    }
}
\`\`\`
            `
        });
    }
    else {
        let winning_team = "";
        
        for (var i in body.winningTeam) {
            let found = await API.checkPlayer(body.winningTeam[i].summonerName);
            if (found[0]) {
                winning_team = found[1];
                break;
            }
        }
        
        body.metaData["win_ID"] = winning_team;
    
        let isOver = await API.saveGame(body);
        let date = new Date();
        let short_month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        if (!isOver[0]) {
            let data = isOver[1];

            let imageURL = `http://api.opsesports.ca/image-generator/create?game=lol&l_score=${data[body.metaData.team1_ID]}&r_score=${data[body.metaData.team2_ID]}&line1=LIVE%20NOW&line2=Regular%20Season&line3=${short_month}%20${date.getDate()},%20${date.getFullYear()}&left=${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].imgID}`;

            axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
                "content": `­\n${league_emojis.lol} - \`${data[body.metaData.team1_ID]}\` ${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].emoji} vs ${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].emoji} \`${data[body.metaData.team2_ID]}\` | [DOWNLOAD](<${imageURL}&download=true>)`,
            });
        }
        else {
            let data = isOver[1];

            let imageURL = `http://api.opsesports.ca/image-generator/create?game=lol&l_score=${data[body.metaData.team1_ID]}&r_score=${data[body.metaData.team2_ID]}&line1=FINAL%20SCORE&line2=Regular%20Season&line3=${short_month}%20${date.getDate()},%20${date.getFullYear()}&left=${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].imgID}&right=${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].imgID}`;

            axios.post(`https://discord.com/api/webhooks/${config.WEBHOOK_ID}/${config.WEBHOOK_TOKEN}`, {
                "content": `­\n${league_emojis.lol} - \`${data[body.metaData.team1_ID]}\` ${teamsInfo.filter(t => t.id == body.metaData.team1_ID)[0].emoji} vs ${teamsInfo.filter(t => t.id == body.metaData.team2_ID)[0].emoji} \`${data[body.metaData.team2_ID]}\` | [DOWNLOAD](<${imageURL}&download=true>)`,
            });
        }
    }

	res.send("LOGGED!!!");
});

module.exports = router;