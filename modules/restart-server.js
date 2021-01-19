const axios = require('axios').default;

axios.post("http://api.opsesports.ca/git-refresh")
    .then(res => console.log(res.data))
    .catch(e => console.log(e.data));