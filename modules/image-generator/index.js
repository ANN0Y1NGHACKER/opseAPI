const jimp = require('jimp'),
    express = require('express'),
    router = express.Router(),
    sass = require('sass'),
    pug = require('pug');

router.use('/assets', express.static(`${__dirname}/assets`));

router.get('/', async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/index.pug`, {
        style: sass.renderSync({file: `${__dirname}/index.scss`}).css.toString(),
    }));
});

router.get('/create/:type', async (req, res) => {
    let missing_params = [];
    switch (req.params.type.toLocaleLowerCase()) {
        case "h2h":
            if (!("game" in req.query)) missing_params.push(" game");
            if (!("home_logo" in req.query)) missing_params.push(" home_logo");
            if (!("away_logo" in req.query)) missing_params.push(" away_logo");
            break;

        case "sc":
            if (!("game" in req.query)) missing_params.push(" game");
            if (!("home_logo" in req.query)) missing_params.push(" home_logo");
            if (!("away_logo" in req.query)) missing_params.push(" away_logo");
            if (!("home_score" in req.query)) missing_params.push(" home_score");
            if (!("away_score" in req.query)) missing_params.push(" away_score");
            if (("home_logo" in req.query) && (parseInt(req.query.home_logo) > 16 || parseInt(req.query.home_logo) < 0)) return res.status(404).end(`Invalid home_logo`);
            if (("away_logo" in req.query) && (parseInt(req.query.away_logo) > 16 || parseInt(req.query.away_logo) < 0)) return res.status(404).end(`Invalid away_logo`);
            if (("home_score" in req.query) && (parseInt(req.query.home_score) > 3 || parseInt(req.query.home_score) < 0)) return res.status(404).end(`Invalid home_score`);
            if (("away_score" in req.query) && (parseInt(req.query.away_score) > 3 || parseInt(req.query.away_score) < 0)) return res.status(404).end(`Invalid away_score`);
            break;
    
        default:
            return res.status(404).end(`Invalid Route`);
    }

    if (missing_params.length != 0) res.end(`Missing Parameters:${missing_params}`);
    else createImg(req.params.type.toLocaleLowerCase(), req.query, res);
});

let createImg = async (type, query, res) => {
    const line1 = await jimp.loadFont(`${__dirname}/assets/fonts/line1.fnt`);
	const line2 = await jimp.loadFont(`${__dirname}/assets/fonts/line2.fnt`);
    const line3 = await jimp.loadFont(`${__dirname}/assets/fonts/line3.fnt`);
    let images = [`${__dirname}/assets/base.png`], ls = 0, rs = 0;

    for (var i in query) {
        switch (i) {
            case "game":
                images.push(`${__dirname}/assets/base/${query[i]}.png`);
                break;

            case "away_score":
                images.push(`${__dirname}/assets/${query[i]}L.png`);
                ls = query[i];
                break;

            case "home_score":
                images.push(`${__dirname}/assets/${query[i]}R.png`);
                rs = query[i];
                break;

            case "crown":
                if (query["crown"] == "on") {
                    if (ls < rs) images.push(`${__dirname}/assets/crownr.png`);
                    else if (ls > rs) images.push(`${__dirname}/assets/crownl.png`);
                }
                break;
        }
    }

    let jimps = [];
    images.map(i => jimps.push(jimp.read(i).catch((e) => {})));

    Promise.all(jimps).then(() => {
		return Promise.all(jimps);
	}).then(async data => {
        data.map(i => data[0].composite(i, 0, 0));

        for (var i in query) {
            switch (i) {
                case "line1":
                    data[0].print(line1, 0, 158, {
						text: query[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
                    break;

                case "line2":
                    data[0].print(line2, 14, 880, {
						text: query[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
                    break;

                case "line3":
                    data[0].print(line3, 20, 950, {
						text: query[i],
						alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
					}, 1920, 1080);
                    break;

                case "away_logo":
                    if (type == "h2h") {
                        let away_logo = await jimp.read(`${__dirname}/assets/logos/${query[i]}.png`).catch((e) => {});
                        try {
                            away_logo.resize(jimp.AUTO, 450)
                            data[0].composite(away_logo, 400, 300);	
                        } catch (e) {};
                    }
                    else {
                        let away_logo = await jimp.read(`${__dirname}/assets/logos/withName/${query[i]}.png`).catch((e) => {});
                        try {
                            away_logo.resize(jimp.AUTO, 120)
                            data[0].composite(away_logo, 280, 620);	
                        } catch (e) {};
                    }
                    break;
                    
                case "home_logo":
                    if (type == "h2h") {
                        let home_logo = await jimp.read(`${__dirname}/assets/logos/${query[i]}.png`).catch((e) => {});
                        try {
                            home_logo.resize(jimp.AUTO, 450)
                            data[0].composite(home_logo, 1070, 300);	
                        } catch (e) {};
                    }
                    else {
                        let home_logo = await jimp.read(`${__dirname}/assets/logos/withName/${query[i]}.png`).catch((e) => {});
                        try {
                            home_logo.resize(jimp.AUTO, 120)
                            data[0].composite(home_logo, 1030, 620);
                        } catch (e) {};
                    }
                    break;
            }
        }
    
        data[0].write(`${__dirname}/image.png`, () => {
            if ("download" in query) res.download(`${__dirname}/image.png`);
            else {
                res.setHeader('content-type', 'image/jpeg');
                res.sendFile(`${__dirname}/image.png`);
            }
		});
    });
};

module.exports = router;