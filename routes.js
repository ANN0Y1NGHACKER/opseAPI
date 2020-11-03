const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require("express");
const router = express.Router();
const jimp = require('jimp');
const urlparse = require('url-parse');

let wsUsers = JSON.parse(process.env.WS_USERS);

router.get("/home", (req, res) => {res.send("WORKING")});

router.get("/test", (req, res) => {res.send("TEST")});

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
		

		data[0].write(`./public/post.png`, () => {res.sendFile(`${__dirname}/public/post.png`)});
	});
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