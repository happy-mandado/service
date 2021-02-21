module.exports = {
  api: {
    port: 8081,
    auth: {
      cookieName: 'mandado-dev',
      domain: 'happymandado.auth0.com',
      scope: 'openid email profile',
      audience: 'https://service.happymandado.com',
      origin: ['http://happymandado.local:3000'],
      credentials: true,
    },
  },
  db: {
    driver: 'mongoose',
    scheme: 'mongodb',
    options: {
      useNewUrlParser: true,
    },
    database: 'happy_mandado_dev',
    host: 'localhost',
    port: 27017,
  },
};
