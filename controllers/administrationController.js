'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');
const participationModel = require('../models/participationModel');

const path = require('path');
const fs = require('fs');

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
	let userTypeKeyword = sanitizeInput(req.query.userTypeKeyword) || '';
	let userStatusKeyword = sanitizeInput(req.query.userStatusKeyword) || '';
	let userKeyword = sanitizeInput(req.query.userKeyword) || '';
	let options = {};
	// Sort
	// let sortby = req.query.sortby || 'Name';
	// let order = req.query.order || 'asc';
	// options.order = [[sortby, order]];

    // Pagination
    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
    let limit = 3;
    let skip = (page - 1) * limit;

    options.limit = limit;
    options.skip = skip;  
    console.log(options);

	let query = {};

	query.Name = { $regex: userKeyword, $options: 'i' };
	query.AccountEmail = { $regex: userKeyword, $options: 'i' };
	// Filter by userTypeKeyword
	if (userTypeKeyword) {
		if (userTypeKeyword === 'Admin') {
			query.IsAdmin = true;
		} else if (userTypeKeyword === 'User') {
			query.IsAdmin = false;
		} else {
			query.IsAdmin = null;
		}
	}
	if (userStatusKeyword && userStatusKeyword !== 'All') {
		query.Status = userStatusKeyword;
	}

    // Querying (filter)
    let users = await userModel.find(query, null);
    const usersCount = await users.length;
    // Slice the users array to limit the number of users displayed
    // Validate if the skip is greater than the number of users
    if (skip > usersCount) {
        skip = 0;
        page = 1;
    }


    users = users.slice(skip, skip + limit);

    // Pagination numerical data
    res.locals.pagination = 
    {
        page: page,
        limit: limit,
        showing: users.length,
        totalRows: usersCount,
        queryParams: req.query
    };

	// Calculate total, active, and inactive users
	const totalUser = await userModel.countDocuments();
	const activeUser = await userModel.countDocuments({ Status: 'Active' });
	const inactiveUser = await userModel.countDocuments({ Status: 'Inactive' });

	const projects = await projectModel.find();

	const account = req.user;
    const user = await userModel.findOne({ AccountEmail: account.Email });

	res.render('administration', {
		title: 'ShareBug - Administration',
		header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
		d3: 'selected-menu-item',
		user,
		data: users,
		totalUser,
		activeUser,
		inactiveUser,
		userTypeKeyword,
		userStatusKeyword,
		projects
	});
};

controller.showAddUser = async (req, res) => {
	const projects = await projectModel.find();
	const account = req.user;
    const user = await userModel.findOne({ AccountEmail: account.Email });

	res.render('administration-add-user', {
		title: 'ShareBug - Administration Add User',
		header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
		d3: 'selected-menu-item',
		user,
		projects
	});
};

controller.addUser = async (req, res) => {
	try {
		const {
			'first-name': firstName,
			'last-name': lastName,
			email,
			language,
			status,
			'user-designation': userDesignation,
			isAdmin,
			projectId,
			'access-type': accessType,
			locale,
			timezone
		} = req.body;

		const image = req.file ? req.file.filename : 'default-user-image.png';

		const user = new userModel({
			Name: `${firstName} ${lastName}`,
			AccountEmail: email,
			Language: language || 'English',
			Designation: userDesignation || '',
			Locale: locale || '',
			Timezone: timezone || '',
			IsAdmin: isAdmin,
			Status: status || 'Active',
			UserImg: image // Lưu tên file ảnh vào database
		});

		const savedUser = await user.save();

		if (projectId && accessType) {
			const participation = new participationModel({
				Role: accessType,
				UserID: savedUser._id,
				ProjectID: projectId
			});
	
			await participation.save();
		}

		

		res.status(201).json({ message: 'User created successfully', user: savedUser });
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

controller.editUser = async (req, res) => {
	try {
		const userId = req.body['user-id'];
		const {
			'first-name': firstName,
			'last-name': lastName,
			email,
			language,
			status,
			'user-designation': userDesignation,
			isAdmin,
			locale,
			timezone,
			'user-img': oldImage
		} = req.body;

		const image = req.file ? req.file.filename : 'default-user-image.png';

		if (req.file && oldImage && oldImage !== 'default-user-image.png') {
			const oldImagePath = path.join(__dirname, '../public/images', oldImage);
			fs.unlink(oldImagePath, (err) => {
				if (err) {
					console.error('Failed to delete old image:', err);
				} else {
					console.log('Old image deleted:', oldImagePath);
				}
			});
		}

		const updatedData = {
			Name: `${firstName} ${lastName}`,
			AccountEmail: email,
			Language: language || 'English',
			Designation: userDesignation || '',
			Locale: locale || '',
			Timezone: timezone || '',
			IsAdmin: isAdmin,
			Status: status || 'Active',
			UserImg: image // Cập nhật tên file ảnh trong database
		};

		await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

		res.status(200).json({ message: 'User updated successfully' });
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

controller.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { userImg } = req.body;

		// Tìm và xóa người dùng
		const userResult = await userModel.findByIdAndDelete(id);
		if (!userResult) {
			return res.status(404).json({ message: 'User not found.' });
		}

		// Xóa ảnh người dùng nếu không phải là ảnh mặc định
		if (userImg && userImg !== 'default-user-image.png') {
			const imagePath = path.join(__dirname, '../public/images', userImg);
			fs.unlink(imagePath, (err) => {
				if (err) {
					console.error('Failed to delete old image:', err);
				} else {
					console.log('Old image deleted:', imagePath);
				}
			});
		}

		// Tìm và xóa các bản ghi participation liên quan đến người dùng này
		const participationResult = await participationModel.deleteMany({ UserID: id });

		res.status(200).json({
			message: 'User and associated participations deleted successfully.',
			deletedParticipations: participationResult.deletedCount
		});
	} catch (error) {
		console.error('Error deleting user and participations:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = controller;
