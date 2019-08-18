const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    "rethinkdb": {
        "host": "futbot-rethinkdb-1",
        "port": "28015",
        "db": "futbot"
    },
    "roptions": {
        "uri": "https://www.easports.com/fifa/ultimate-team/api/fut/display",
        "headers": { "Cache-Control": "no-cache" }
    }
}
