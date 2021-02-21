const mongoose = require('mongoose');

const ListStore = require('./stores/list');
const UserStore = require('./stores/user');

class MongooseDatabase {
  constructor({
    scheme, host, port, user, password, database, options,
  }) {
    this.scheme = scheme;
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.name = database;
    this.connection = null;

    this.connect(options);

    this.lists = new ListStore();
	this.users = new UserStore();
  }

  buildURI() {
    let uri = `${this.scheme}://`;

    if (this.user && this.password) {
      uri += `${this.user}:${this.password}@`;
    }

    uri += this.host;

    if (this.port) {
      uri += `:${this.port}`;
    }

    uri += `/${this.name}`;

    return uri;
  }

  connect(options) {
    if (!this.connection) {
      this.connection = mongoose
        .connect(this.buildURI(), options)
        .catch(error =>
          console.log(`Error while connecting to Mongo: ${error}`)
        );
    }

    return this.connection;
  }

  disconnect() {
    if (this.connection) {
      return this.connection
        .then(_ => _.connection.close());
    }
  }
}

module.exports = MongooseDatabase;
