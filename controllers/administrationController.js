'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
const userModel = require('../models/userModel');

controller.show = async (req, res) => {
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

    const users = await userModel.find(null, null, options);     //console.log(users);
    const usersCount = await userModel.countDocuments(); 
    res.locals.pagination = 
    {
        page: page,
        limit: limit,
        showing: users.length,
        totalRows: usersCount,
        queryParams: req.query
    };


    res.render('administration', { 
        title: "ShareBug - Administration", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
        d3: "selected-menu-item", 
        data: users,
    });
}


controller.showAddUser = (req, res) => {
    
    res.render('administration-add-user', { 
        title: "ShareBug - Administration Add User", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
        d3: "selected-menu-item", 
    });
}

module.exports = controller;