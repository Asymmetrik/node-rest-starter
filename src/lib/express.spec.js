'use strict';

const path = require('path'),
	swaggerJsDoc = require('swagger-jsdoc'),
	swaggerParser = require('swagger-parser'),
	deps = require('../dependencies'),
	config = deps.config;

/**
 * Unit tests
 */
describe('Init Swagger API:', () => {
	it('Generated Swagger API should be valid', async () => {
		const swaggerOptions = {
			swaggerDefinition: {
				openapi: '3.0.2',
				info: {
					title: config.app.title,
					description: config.app.description,
					version: 'test'
				},
				servers: [
					{
						url: 'https://api.example.com/api'
					}
				]
			},
			apis: [
				...config.files.docs.map((doc) => path.posix.resolve(doc)),
				...config.files.routes.map((route) => path.posix.resolve(route)),
				...config.files.models.map((model) => path.posix.resolve(model))
			]
		};

		if (config.auth.strategy === 'local') {
			swaggerOptions.swaggerDefinition.components =
				swaggerOptions.swaggerDefinition.components || {};
			swaggerOptions.swaggerDefinition.components.securitySchemes = {
				basicAuth: {
					type: 'http',
					scheme: 'basic'
				}
			};
		}

		const swaggerSpec = swaggerJsDoc(swaggerOptions);
		await swaggerParser.validate(swaggerSpec);
	});
});
