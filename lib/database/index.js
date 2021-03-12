const ElasticSearchDatabase = require('./elastic-search');
const MongooseDatabase = require('./mongoose');
const errors = require('./errors');

function create(dbConfig) {
  let database;

  switch (dbConfig.driver) {
    case 'memory':
      // database = new MemoryDatabase(dbConfig);
      break;
    case 'mongoose':
      database = new MongooseDatabase(dbConfig);
      break;
    case 'elasticsearch':
	  database = new ElasticSearchDatabase(dbConfig);
    default:
      database = null;
  }

  if (!database) {
    throw new errors.UnsupportedDatabaseDriver(dbConfig.driver);
  }

  return database;
}


module.exports = {
  create,
};
