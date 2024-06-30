'use strict';

const controller = {};
const passport = require('passport');
const userModel = require('../models/userModel');


controller.show = async (req, res) => {
	const errorMessages = req.flash('error');
	
	res.render('login', {
		title: 'ShareBug - Login',
		header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/login.css" />`,
        display: 'display-none',
        btnLogin: 'btn-login',
		errorMessages
	});
};

controller.login = (req, res, next) => {
	passport.authenticate('local', {
	  successRedirect: '/dashboard',
	  failureRedirect: '/login',
	  failureFlash: true
	})(req, res, next);
};


module.exports = controller;
