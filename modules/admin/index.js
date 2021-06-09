const
    project = require('../../package.json'),
    GAMES = require('./lol-stats/games.json'),

    express = require('express'),
    router = express.Router(),
    sass = require('sass'),
    pug = require('pug')

let checkSession = (req, res, next) => {
    if (!req.session || !req.session.user) {
        let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        req.session.oldURL = fullUrl;
        res.redirect('/admin/login');
    } else next();
}

router.get('/', async (req, res) => {
    if (!req.session || !req.session.user) res.redirect('/admin/login');
    else res.redirect('/admin/dashboard');
});

router.get('/dashboard', checkSession, async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/views/dashboard.pug`, {
        STYLE: sass.renderSync({file: `${__dirname}/sass/dashboard.scss`}).css.toString(),
        VERSION: project.version,
    }));
});

router.get('/lol-games/match-history', checkSession, async (req, res) => {
    res.send(pug.renderFile(`${__dirname}/views/lol-match-history.pug`, {
        STYLE: sass.renderSync({file: `${__dirname}/sass/lol-match-history.scss`}).css.toString(),
        VERSION: project.version,
        GAMES: GAMES,
    }));
});

router.route('/login')
    .get(async (req, res) => {
        res.send(pug.renderFile(`${__dirname}/views/login.pug`, {
            style: sass.renderSync({file: `${__dirname}/sass/login.scss`}).css.toString(),
        }));
    })
    .post(async (req, res) => {
        if (!req.body.password) res.sendStatus(403);
        else {
            if (req.body.password === process.env.API_PASSWORD) {
                req.session.user = { username: "admin" };
                res.redirect('/admin');
            }
            else res.redirect('/admin');
        }
    })

module.exports = router;