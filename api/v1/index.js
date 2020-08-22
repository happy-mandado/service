const express = require('express');
const config = require('config');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const getAuthMiddlewares = require('@happy-mandado/auth')
const middlewares = require('./middlewares');


const app = express();
app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());

module.exports = (auth, database, useCases) => {

  const authMiddlewares = getAuthMiddlewares(auth);
  app.use(authMiddlewares.cors);
  app.use(authMiddlewares.auth);

  app.get('/v1/users/:userId', function(req, res) {
    const user = {
      email: req.user.email,
      id: req.user.sub,
      surname: req.user.family_name,
      name: req.user.given_name,
      locale: req.user.locale,
      fullName: req.user.name,
      handler: req.user.nickname,
      picture: req.user.picture,
    }

    res.json(user)
  })
  app.get('/v1/users/:userId/products', function(req, res) {
    res.send();
  });

  app.post('/v1/users/:userId/products', function(req, res) {
    res.send();
  });

  app.put('/v1/users/:userId/products/:productId', function(req, res) {
    res.send();
  });

  app.get('/v1/users/:userId/lists', function(req, res) {
    res.send();
  });

  app.post('/v1/users/:userId/lists', function(req, res) {
    res.send();
  });

  app.put('/v1/users/:userId/lists/:listId', function(req, res) {
    res.send();
  });

  app.get('/v1/users/:userId/drafts', function(req, res) {
    res.send();
  });

  app.post('/v1/users/:userId/drafts', function(req, res) {
    res.send();
  });

  app.put('/v1/users/:userId/drafts/:draftId', function(req, res) {
    res.send();
  });

  app.post('/v1/users/:userId/drafts/:draftId/products', function(req, res) {
  });

  app.get('/v1/users/:userId/suggestions', function(req, res) {
    res.send();
  });

  return app;
};
