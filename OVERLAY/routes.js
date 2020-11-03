const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require("express");
const router = express.Router();
const jimp = require('jimp');
const urlparse = require('url-parse');

router.get("/test", (req, res) => {res.send(`PORT 3001 TEST`)});

module.exports = router;