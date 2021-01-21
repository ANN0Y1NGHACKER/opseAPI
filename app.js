require('dotenv-flow').config();
require('./modules/auto-generator');

const
    config = require('./config'),
    express = require('express'),
    app = express()

app.use(require('express-session')({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true
    }))
    .use(express.urlencoded({ extended: true }))
    .use(require('body-parser').json())
    .set('json replacer', null)
    .set('json spaces', 4)
    .use(require('./routes'))
    .use('/admin', require('./modules/admin'))
    .use('/image-generator', require('./modules/image-generator'))
    .use(express.static('public'))


app.listen(3000, () => {
    console.log("Server started on port: 3000")
});