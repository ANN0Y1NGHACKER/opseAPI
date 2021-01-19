const jimp = require('jimp'),
    express = require('express'),
    router = express.Router();

router.get('/', async (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

router.get('/create', async (req, res) => {
    const line1 = await jimp.loadFont(`${__dirname}/assets/fonts/line1.fnt`);
	const line2 = await jimp.loadFont(`${__dirname}/assets/fonts/line2.fnt`);
    const line3 = await jimp.loadFont(`${__dirname}/assets/fonts/line3.fnt`);
    
    const query = req.query;

    let images = [`${__dirname}/assets/base.png`], ls = 0, rs = 0;

    for (var i in query) {
        switch (i) {
            case "game":
                images.push(`${__dirname}/assets/base/${query[i]}.png`);
                break;

            case "l_score":
                images.push(`${__dirname}/assets/${query[i]}L.png`);
                ls = query[i];
                break;
        
            case "r_score":
                images.push(`${__dirname}/assets/${query[i]}R.png`);
                rs = query[i];
                break;

            case "crown":
                if (query["crown"] == "true") {
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
        data.map(i => data[0].composite(i, 0, 0))

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

                case "left":
                    let logoIMGl_wn = await jimp.read(`${__dirname}/assets/logos/withName/${query[i]}.png`).catch((e) => {});
					try {
						logoIMGl_wn.resize(jimp.AUTO, 120)
						data[0].composite(logoIMGl_wn, 280, 620);	
					} catch (e) {};
                    break;
                    
                case "right":
                    let logoIMGr_wn = await jimp.read(`${__dirname}/assets/logos/withName/${query[i]}.png`).catch((e) => {});
					try {
                        logoIMGr_wn.resize(jimp.AUTO, 120)
						data[0].composite(logoIMGr_wn, 1030, 620);
					} catch (e) {};
                    break;
                    
                case "left_logo":
					let logoIMGl = await jimp.read(`${__dirname}/assets/logos/${query[i]}.png`).catch((e) => {});
					try {
						logoIMGl.resize(jimp.AUTO, 450)
						data[0].composite(logoIMGl, 400, 300);	
					} catch (e) {};
					break;

				case "right_logo":
					let logoIMGr = await jimp.read(`${__dirname}/assets/logos/${query[i]}.png`).catch((e) => {});
					try {
						logoIMGr.resize(jimp.AUTO, 450)
						data[0].composite(logoIMGr, 1070, 300);	
					} catch (e) {};
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
});

module.exports = router;