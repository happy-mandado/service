const express = require('express');
const config = require('config');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const getAuthMiddlewares = require('@happy-mandado/auth')
const middlewares = require('./middlewares');
const errors = require('./errors');
const {
	serializeUser, serializeProduct, serializeList, serializeDraft,
} = require('./serializers');


const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


module.exports = (authConfig, service) => {
	const authMiddlewares = getAuthMiddlewares(authConfig);
	app.use(authMiddlewares.cors);
	// TODO: Add auth for dev
	app.use(authMiddlewares.auth);

	app.get('/v1/users/:userId', function(req, res) {
		if (req.params.userId !== req.user.sub) {
			return res
				.status(404)
				.json(errors.UserNotFound(req.params.userId))
		}

		res
			.status(200)
			.json(serializeUser(req.user))
	})
	app.get('/v1/users/:userId/products', function(req, res) {
		// TODO: Add API error handling
		service.getBoughtUserProducts(req.user.sub)
			.then(products => res
				.status(200)
				.json(products.map(serializeProduct))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.get('/v1/users/:userId/lists', function(req, res) {
		service.getUserClosedLists(requser.sub)
			.then(lists => res
				.status(200)
				.json(lists.map(serializeList))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.post('/v1/users/:userId/lists', function(req, res) {
		service.closeUserList(req.user.sub, req.body.draftId, req.body.products)
			.then(list => res
				.status(201)
				.json(serializeList(list))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.get('/v1/users/:userId/drafts', function(req, res) {
		service.getUserUnclosedList(req.user.sub)
			.then(drafts => res
				.status(200)
				.json(drafts.map(serializeDraft))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.post('/v1/users/:userId/drafts', function(req, res) {
		service.createUserList(req.user.sub, req.body)
			.then(draft => res
				.status(201)
				.json(serializeDraft(draft))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.put('/v1/users/:userId/drafts/:draftId', function(req, res) {
		req.body.id = req.params.draftId
		service.updateUserList(req.user.sub, req.body)
			.then(draft => res
				.status(200)
				.json(serializeDraft(draft))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.get('/v1/users/:userId/drafts/:draftId/products', function(req, res) {
		// TODO: Add API error handling
		service.getUnbougthUserProducts(req.user.sub)
			.then(products => res
				.status(200)
				.json(products.map(serializeProduct))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.post('/v1/users/:userId/drafts/:draftId/products', function(req, res) {
		service.createUserProduct(req.user.sub, req.body)
			.then(product => res
				.status(201)
				.json(serializeProduct(product))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.put('/v1/users/:userId/drafts/:draftId/products/:productId', function(req, res) {
		req.body.product.id = req.params.productId
		service.updateUserProduct(req.user.sub, req.product)
			.then(product => res
				.status(200)
				.json(serializeProduct(product))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.delete('/v1/users/:userId/drafts/:draftId/products/:productId', function(req, res) {
		service.removeUserProduct(req.user.sub, req.params.productId)
			.then(product => res
				.status(200)
				.json(serializeProduct(product))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	app.get('/v1/users/:userId/suggestions', function(req, res) {
		service.getUserProductSuggestions(req.user.sub)
			.then(suggestions => res
				.status(200)
				.json(suggestions.map(serializeSuggestion))
			)
			.catch(error => res
				.status(500)
				.json({ error: error.message })
			);
	});

	return app;
};
