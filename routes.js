
"use strict";

var fs = require('fs');

var _ = require('underscore');
var passport = require('passport');
var mongoose = require('mongoose');

var projects = [];

process.on('SIGINT', function () {
	console.log('Save data');
	fs.writeFileSync('data.json', JSON.stringify(projects, null, 2));
	process.exit();
});

try {
	projects = JSON.parse(fs.readFileSync('data.json'));
}
catch (ex) {
	console.log(ex);
}

if (0 === projects.length) {

	console.log('Init data');

	projects.push({
		id: mongoose.Types.ObjectId().toString(),
		name: 'First item'
	});

	projects.push({
		id: mongoose.Types.ObjectId().toString(),
		name: 'Second item'
	});

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
		return;
	}
	res.redirect('/');
}

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
		return;
	}

	res.status(403).send({
		message: 'Not logged in'
	});
}

module.exports = function (app) {

	app.get('/', function(req, res){
		res.render('index', {
			user: req.user,
			message: req.session.messages
		});
	});

	app.get('/account', isAuthenticated, function(req, res) {
		res.status(200).send({
			user: _.omit(req.user.toObject(), 'password', '__v')
		});
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				next(err);
				return;
			}

			if (!user) {
				res.status(403).send({
					message: [info.message]
				});
				return;
			}

			req.logIn(user, function(err) {
				if (err) {
					next(err);
					return;
				}

				res.redirect('/account');
			});

		})(req, res, next);
	});

	app.get('/logout', isAuthenticated, function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// -----------------------------------------------------------------------

	app.delete('/projects/:id', isAuthenticated, function (req, res, next) {
		var project = req.body;

		console.log('REQ:\n%s\n', project);

		res.status(200).send(project);
	});

	// -----------------------------------------------------------------------

	app.get('/projects', isAuthenticated, function (req, res, next) {

		console.log('RES:\n%s\n', projects);

		res.status(200).send(projects);
	});

	app.post('/projects', isAuthenticated, function (req, res, next) {
		var project = req.body;

		console.log('REQ:\n%s\n', project);

		project.id = mongoose.Types.ObjectId().toString();
		projects.push(project);

		console.log('RES:\n%s\n', project);

		res.status(200).send(project);
	});

	app.put('/projects/:id', isAuthenticated, function (req, res, next) {
		if (req.params.id !== req.body.id) {
			res.status(400).send({ message: 'id does not match' });
			return;
		}

		projects = projects.map(function (el) {
			if (el.id === req.params.id) {
				return req.body;
			}
			return el;
		});

		console.log('RES:\n%s\n', req.body);

		res.status(200).send(req.body);
	});

};

