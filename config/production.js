module.exports = {
  api: {
    port: null,
    origin: '',
    auth: {
      cookieName: '',
      domain: '',
      scope: '',
      audience: '',
    },
  },
  db: {
    driver: 'mongoose',
    scheme: 'mongodb',
    options: {
      useNewUrlParser: true,
    },
    database: '',
    host: '',
    port: null,
  },
};
