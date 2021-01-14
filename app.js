require('dotenv-flow').config();
const config = require('./config').init();
global.CONFIG = config;

const
    bodyParser = require('body-parser'),
    express = require('express'),
    app = express()

app.use(bodyParser.json())
    .use(express.urlencoded({ extended: true }))
    .set('json replacer', null)
    .set('json spaces', 4)
    .use(require('./routes'))
    .use('/image-generator', require('./modules/image-generator'))
    .use(express.static('public'))


app.listen(3000, () => {
    console.log("Server started on port: 3000")
});