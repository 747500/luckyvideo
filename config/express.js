
"use strict";

var path = require('path');

var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('express-session-mongo')
var passport = require('passport');

module.exports = function (app, config) {

	app.set('showStackError', true);

	app.use(morgan('dev')); // { format: ':method ":url" :status' }

/*
	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
			var h = rsdfes.getHeader('Content-Type');
			return /json|text|javascript|css/.test(h)
		},
		level: 6
	}));
*/

	app.use(express.static(path.join(config.root, 'public')));

	//app.set('views', path.join(config.root, 'views'));
	//app.set('view engine', 'jade');

	app.set('views', path.join(config.root, 'views'));
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(cookieParser());

	app.use(session({
		store: new MongoStore({
			db: 'luckyvideo',
			ip: '127.0.0.1'
		}),
		secret: 'lsdfjnv',
		proxy: true,
    	resave: true,
    	saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(function (req, res, next) {
		if (req.method == 'POST' && req.url == '/login') {
			if (req.body.rememberme) {
				req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
			} else {
				req.session.cookie.expires = false;
			}
		}

		next();
	});

	app.use(errorHandler({
		showStack: true,
		dumpExceptions: true
	}));

	app.locals.pretty = true;

};
