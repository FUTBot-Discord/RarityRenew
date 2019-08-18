const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    "rethinkdb": {
        "host": process.env.RDB_HOST,
        "port": process.env.RDB_PORT,
        "db": process.env.RDB_DB
    },
    "roptions": {
        "uri": process.env.REQUEST_URI,
        "headers": { "Cache-Control": "no-cache" }
    }
}
