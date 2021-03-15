const { Client } = require('@elastic/elasticsearch');

const ProductStore = require('./stores/product');
const ListStore = require('./stores/list');

let client = null;

class ElasticSearchDatabase {
	constructor({
		scheme, host, port, user, password, url, apiKey,
	}) {
		this.scheme = scheme;
		this.host = host;
		this.port = port;
		this.user = user;
		this.password = password;
		this.url = url;

		const options = {};
		options.node = this.buildURI();

		if (apiKey) {
			options.auth = {
				apiKey,
			};
		}

		client = client || new Client(options);

		this.lists = new ListStore('lists', client);
		this.products = new ProductStore('products', client);
	}

	buildURI() {
		let credentials = '';
		if (this.user && this.password) {
			credentials = `${this.user}:${this.password}@`;
		}

		let port = '';
		if (this.port) {
			port = `:${this.port}`;
		}

		let uri = `${this.scheme}://${credentials}${this.host}${port}`;
		if (this.url) {
			uri = this.url;
		}

		return uri;
	}
}

module.exports = ElasticSearchDatabase;
