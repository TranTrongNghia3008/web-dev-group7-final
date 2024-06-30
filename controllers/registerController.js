'use strict';

const controller = {};
const bcrypt = require('bcrypt');
const accountModel = require('../models/accountModel');
const userModel = require('../models/userModel');


controller.show = async (req, res) => {
	
	res.render('register', {
		title: 'ShareBug - Register',
		header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/register.css" />`,
        display: 'display-none'
	});
};

controller.register = async (req, res) => {
	const { 'first-name': firstName, 'last-name': lastName, email, password, domain } = req.body;
	try {
		let account = await accountModel.findOne({ Email: email });
		if (account) {
		req.flash('error_msg', 'Email already exists');
		return res.redirect('/register');
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newAccount = new accountModel({
			Email: email,
			Password: hashedPassword,
			IsVerified: false
		});
  
	  	await newAccount.save();
  
		const newUser = new userModel({
			Name: `${firstName} ${lastName}`,
			AccountEmail: email,
			Domain: domain,
		});
  
		await newUser.save();
		req.flash('success_msg', 'You are registered and can now login');
	
		res.redirect('/login');
	} catch (error) {
	  console.error(error);
	  req.flash('error_msg', 'Something went wrong. Please try again.');
	  res.redirect('/register');
	}
  };


module.exports = controller;
