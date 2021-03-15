require('dotenv').config();
const config = require('config');
const { Client } = require('@elastic/elasticsearch');

const { scheme, user, password, host, port, apiKey } = config.db;
const node = `${scheme}://${user}:${password}@${host}:${port}`;
const esClient = new Client({
	node,
});

const index = 'products';
const size = 10000;
const query = {
	match_all: {},
};

esClient.search({ body: { query }, index, size })
	.then((response) => {
		for (const doc of response.body.hits.hits) {
			const command = {
				index: {
					_id: doc._id,
					_index: doc._index,
					_type: '_doc',
				}
			};

			const body = { ...doc._source };

			console.log(JSON.stringify(command));
			console.log(JSON.stringify(body));
		}
	})
	.catch(error => console.log(JSON.stringify(error)));

