require('dotenv').config();
const config = require('config');

const api = require('./api/v1');
const DB = require('./lib/database/elasticsearch');
const Service = require('./lib/service');

const db = new DB(config.db);
const service = new Service(db);
config.api.auth.credentials = !!config.api.auth.credentials;
const app = api(config.api.auth, service);

app.disable('x-powered-by');
app.listen(config.api.port || config.api.dynamicPort);
console.log("Happy Mandado service listening on ", config.api.port);
