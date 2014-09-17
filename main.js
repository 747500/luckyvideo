
"use strict";

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var util = require('util');
var fs = require('fs');

var _ = require('underscore');

var mongoose = require('mongoose');

mongoose.set('debug', true);

var uristring = 'mongodb://127.0.0.1/luckyvideo';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: %s.\n%s', uristring, err.stack || err);
		process.exit(2);
	}

	console.log ('Succeeded connected to: %s', uristring);
});

require('./model/user');

(function () {
// Seed a user

	var User = mongoose.model('User');

	User.count(function (err, count) {
		if (count) {
			console.log('Users registered: %d', count);
			return;
		}

		console.log('There is no users registered.');

		var user = new User({
			username: 'admin',
			email: 'bob@example.com',
			password: 'gfhjkm'
		});

		user.save(function(err) {
			if(err) {
				console.log(err.stack || err);
			} else {
				console.log('user created: %s', user.username);
			}
		});

	});

})();

require('./config/passport');

var express = require('express');
var app = express();

require('./config/express')(app, config);
require('./routes')(app);

var bindTo = {
	host: '0.0.0.0',
	port: 25005
};

app.listen(bindTo.port, bindTo.host, function () {
    console.log('http: listen %s:%s', bindTo.host, bindTo.port);
});
