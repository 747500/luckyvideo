
"use strict";

var request = require('request');

request.post({
//	url: 'http://' + clientCredentials + '@localhost:25005/oauth/token',
	url: 'http://localhost:25005/oauth/token',
	form: {
		grant_type: 'password',
		username: '747500@gmail.com',
		password: 'some-password',
		client_id: 'example-client',
		client_secret: 'password'
	},
}, function(err, res, body) {
	var accessToken = JSON.parse(body).access_token;

	console.log('accessToken: %s', accessToken);

	request.get({
		url: 'http://localhost:25005/tasks',
		headers: { Authorization: 'Bearer ' + accessToken }
	}, function(err, res, body) {
		console.log(body);
	});
});
