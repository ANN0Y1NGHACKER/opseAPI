const app = require('express')();

app.get('/', (req, res) => {res.send("TEST")})

app.listen(3001)
