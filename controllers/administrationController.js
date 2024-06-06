'use strict';

const controller = {};
const userModel = require('../models/userModel');

controller.show = async (req, res) => {
    const users = await userModel.find({});
    res.render('administration', { 
        title: "ShareBug - Administration", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
        d3: "selected-menu-item", 
        data: users
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