
"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// User Schema
var User = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

// Bcrypt middleware
User.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) {
		next();
		return;
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
			next(err);
			return;
		}

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) {
				next(err);
				return;
			}

			user.password = hash;
			next();
		});
	});
});

// Password verification
User.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) {
			cb(err);
			return;
		}

		cb(null, isMatch);
	});
};

mongoose.model('User', User);
