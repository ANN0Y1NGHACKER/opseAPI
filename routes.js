const
    exec = require('util').promisify(require('child_process').exec),
    express = require('express'),
    router = express.Router();

router.get("/", (req, res) => {res.end("OPSE API -  v1.0.0")});
router.get("/index.php", (req, res) => {res.end("OPSE API -  v1.0.0")});

router.post('/git-refresh', async (req, res) => {
    console.log("Pulling from git");
    await exec('git reset --hard HEAD');
    await exec('git pull');
    res.end("Server in sync with git");
    console.log("Pulled from git");
});


module.exports = router;