const
    express = require('express'),
    app = express()


app.set('json replacer', null)
    .set('json spaces', 4)
    .use(require('./routes'))
    .use('/image-generator', require('./modules/image-generator'))
    .use(express.static('public'))


app.listen(3000, () => {
    console.log("Server started on port: 3000")
});