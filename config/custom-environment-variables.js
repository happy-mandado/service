module.exports = {
	api: {
		port: 'API_PORT',
		dynamicPort: 'PORT',
		auth: {
			cookieName: 'API_AUTH_COOKIE_NAME',
			domain: 'API_AUTH_DOMAIN',
			scope: 'API_AUTH_SCOPE',
			audience: 'API_AUTH_AUDIENCE',
			origin: 'API_AUTH_ORIGIN',
			credentials: 'API_AUTH_CREDENTIALS',
		},
	},
	db: {
		driver: 'DB_DRIVER',
		scheme: 'DB_SCHEME',
		options: {
			useNewUrlParser: 'DB_OPTIONS_USE_NEW_URL_PARSER',
		},
		database: 'DB_DATABASE',
		host: 'DB_HOST',
		port: 'DB_PORT',
		url: 'SEARCHBOX_SSL_URL',
		user: 'DB_USER',
		password: 'DB_PASSWORD',
		apiKey: 'DB_API_KEY',
	},
};
