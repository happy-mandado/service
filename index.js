// require('dotenv').config()
const config = require('config');

const db = require('./lib/database');
const useCases = require('./lib');
const api = require('./api/v1');

const database = db.create(config.db);
const app = api(config.api.auth, database, useCases);

app.disable('x-powered-by')
app.listen(config.api.port)
console.log("Happy Mandado service listening on ", config.api.port);
