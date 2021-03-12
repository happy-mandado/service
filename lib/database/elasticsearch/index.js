const { Client } = require('@elastic/elasticsearch');

const ProductStore = require('./stores/product');
const ListStore = require('./stores/list');

let client = null;

class ElasticSearchDatabase {
	constructor({
		host, port, user, password, options, url,
	}) {
		this.host = host;
		this.port = port;
		this.user = user;
		this.url = url;
		this.password = password;
		this.client = null;

		client = client || new Client({
			node: this.buildURI(),
		});

		this.lists = new ListStore('lists', client);
		this.products = new ProductStore('products', client);
	}

	buildURI() {
		let uri = this.url || `http://${this.host}`;

		if (this.port) {
			uri += `:${this.port}`;
		}

		return uri;
	}
}

module.exports = ElasticSearchDatabase;
