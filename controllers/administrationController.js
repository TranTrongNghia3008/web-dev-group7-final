'use strict';

const controller = {};
const csv = require('csv-parser');
const ObjectsToCsv = require('objects-to-csv');
const detect = require('detect-csv');
const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');
const participationModel = require('../models/participationModel');

const path = require('path');
const fs = require('fs');

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
	const account = req.user;
	const user = await userModel.findOne({ AccountEmail: account.Email });

	if (!user.IsAdmin) {
		res.render('not-have-access', { 
			title: "ShareBug - Not Have Access", 
			header: `<link rel="stylesheet" href="/css/shared-styles.css" />
					<link rel="stylesheet" href="/css/not-have-access.css" />`, 
			d3: "selected-menu-item", 
			user,
		});

	}


	
	let userTypeKeyword = sanitizeInput(req.query.userTypeKeyword) || '';
	let userStatusKeyword = sanitizeInput(req.query.userStatusKeyword) || '';
	let userKeyword = sanitizeInput(req.query.userKeyword) || '';
	let options = {};

	// Sort
	// let sortby = req.query.sortby || 'Name';
	// let order = req.query.order || 'asc';
	// options.order = [[sortby, order]];

    

    

	let query = {};

	// Sử dụng $or để kết hợp Name và AccountEmail với regex
	query.$or = [
		{ Name: { $regex: userKeyword, $options: 'i' } },
		{ AccountEmail: { $regex: userKeyword, $options: 'i' } }
	];

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

	// Filter by userStatusKeyword
	if (userStatusKeyword && userStatusKeyword !== 'All') {
		query.Status = userStatusKeyword;
	}

	// Querying (filter)
	let users = await userModel.find(query);
    
	// Pagination
	let total = users.length;
	let limit = 5;
	let page = 1;
	// Validate page query 
	let invalidPage = isNaN(req.query.page) 
	|| req.query.page < 1 
	|| (req.query.page > Math.ceil(total / limit) && total > 0)
	|| (req.query.page > 1 && total == 0);
	if (invalidPage) {
		// Redirect to the first page
		return res.redirect(`/administration?userTypeKeyword=${userTypeKeyword}&userStatusKeyword=${userStatusKeyword}&userKeyword=${userKeyword}&page=1`);
	}
	else
	{
		page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
	}
	let skip = (page - 1) * limit;
	let showing = Math.min(total, skip + limit);
	res.locals.pagination = 
	{
		page: page,
		limit: limit,
		showing: showing,
		totalRows: total,
		queryParams: req.query
	};
	// end Pagination


    users = users.slice(skip, skip + limit);

    // Pagination numerical data
    res.locals.pagination = 
    {
        page: page,
        limit: limit,
        showing: users.length,
        totalRows: total,
        queryParams: req.query
    };

	// Calculate total, active, and inactive users
	const totalUser = await userModel.countDocuments();
	const activeUser = await userModel.countDocuments({ Status: 'Active' });
	const inactiveUser = await userModel.countDocuments({ Status: 'Inactive' });

	const projects = await projectModel.find();


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
            'first-name': firstNameBody,
            'last-name': lastNameBody,
            email: emailBody,
            language: languageBody,
            status: statusBody,
            'user-designation': userDesignationBody,
            isAdmin: isAdminBody,
            projectId: projectIdBody,
            'access-type': accessTypeBody,
            locale: localeBody,
            timezone: timezoneBody
        } = req.body;

        // Sanitize each input
        const firstName = sanitizeInput(firstNameBody);
        const lastName = sanitizeInput(lastNameBody);
        const email = sanitizeInput(emailBody);
        const language = sanitizeInput(languageBody);
        const status = sanitizeInput(statusBody);
        const userDesignation = sanitizeInput(userDesignationBody);
        const isAdmin = isAdminBody;
        const projectId = sanitizeInput(projectIdBody);
        const accessType = sanitizeInput(accessTypeBody);
        const locale = sanitizeInput(localeBody);
        const timezone = sanitizeInput(timezoneBody);
		// Kiểm tra độ dài tên
		if (`${firstName} ${lastName}`.length > 50) {
			return res.status(400).json({ message: 'User name must not exceed 50 characters.' });
		}
		// Kiểm tra xem email đã tồn tại chưa
		const existingUser = await userModel.findOne({ AccountEmail: email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists.' });
		}


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
            'first-name': firstNameBody,
            'last-name': lastNameBody,
            email: emailBody,
            language: languageBody,
            status: statusBody,
            'user-designation': userDesignationBody,
            isAdmin: isAdminBody,
            locale: localeBody,
            timezone: timezoneBody,
            'user-img': oldImage
        } = req.body;

        // Sanitize each input
        const firstName = sanitizeInput(firstNameBody);
        const lastName = sanitizeInput(lastNameBody);
        const email = sanitizeInput(emailBody);
        const language = sanitizeInput(languageBody);
        const status = sanitizeInput(statusBody);
        const userDesignation = sanitizeInput(userDesignationBody);
        const isAdmin = isAdminBody || false;
        const locale = sanitizeInput(localeBody);
        const timezone = sanitizeInput(timezoneBody);

		const image = req.file ? req.file.filename : 'default-user-image.png';

		if (firstName == "" || lastName == "" || email == "") {
            return res.status(404).json({ message: 'User info not filled' });
        }
		
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

		await userModel.findByIdAndUpdate(userId, updatedData);

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


controller.showImport = async (req, res) => {
    const account = req.user;
    const user = await userModel.findOne({ AccountEmail: account.Email });

    res.render('administration-import', { 
        title: 'ShareBug - Administration Import',
		header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
		d3: 'selected-menu-item',
        user
    });
}

controller.importUser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        if (req.file.mimetype !== "text/csv") {
            return res.status(400).send('Select CSV files only.');
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const delimiter = detect(fileContent).delimiter;

		const rows = fileContent.split('\n');
        const existingEmails = await userModel.find({ AccountEmail: { $in: rows.map(row => row.split(delimiter)[3]) } });
		console.log(existingEmails)
		if (existingEmails.length > 0) {
			return res.status(400).json({ message: 'Email already exists.' });
		}

		let users = [];
        let participations = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter }))
            .on('data', (row) => {
                const newUser = new userModel({
                    Name: row.Name,
                    UserImg: row.UserImg || "default-user-image.png",
                    IsAdmin: row.IsAdmin === 'true',
                    AccountEmail: row.AccountEmail,
                    Designation: row.Designation || '',
                    Language: row.Language || 'English',
                    Locale: row.Locale || '',
                    Status: row.Status || 'Active',
                    Timezone: row.Timezone || '',
                });

				const newParticipation = new participationModel({
					Role: row.AccessType,
					UserID: newUser._id,
					ProjectID: row.ProjectId || '666011d01cc6e634de0ff711',
				});

				console.log(newUser)
				console.log(newParticipation)
                users.push(newUser);
                participations.push(newParticipation);
            })
            .on('end', async () => {
                try {
                    const createdUsers = await userModel.insertMany(users);
                    const createdParticipations = await participationModel.insertMany(participations);
					console.log(createdUsers)
					console.log(createdParticipations)
                    res.redirect('/administration');
                } catch (error) {
                    console.error('Error importing users:', error);
                    res.status(500).send('Internal server error');
                }
            });

    } catch (error) {
        console.error('Error in importUser:', error);
        res.status(500).send('Internal server error');
    }
};

controller.exportUser = async (req, res) => {
    try {
        const users = await userModel.find({});

        const csvData = users.map(user => ({
            Name: user.Name,
            UserImg: user.UserImg,
            IsAdmin: user.IsAdmin.toString(),
            AccountEmail: user.AccountEmail,
            Domain: user.Domain,
            CreatedAt: user.CreatedAt.getTime().toString(),
            UpdatedAt: user.UpdatedAt.getTime().toString(),
            Designation: user.Designation,
            Language: user.Language,
            Locale: user.Locale,
            Status: user.Status,
            Timezone: user.Timezone
        }));

        const csv = new ObjectsToCsv(csvData);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `userFileExport-${uniqueSuffix}`;
        const filePath = path.join(__dirname, `../public/files/${fileName}.csv`);

        await csv.toDisk(filePath);

        res.download(filePath, 'users_export.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            } else {
                fs.unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error('Error exporting users:', error);
        res.status(500).send('Internal server error');
    }
};

controller.downloadSampleRequirement = async (req, res) => {
    try {
        // Đường dẫn và tên file CSV để lưu trữ
        const filePath = path.join(__dirname, '../public/files/testImportUser.csv');

        // Chuẩn bị phản hồi để tải xuống file CSV
        res.download(filePath, 'sample_users.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        console.error('Error exporting requirements:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = controller;
