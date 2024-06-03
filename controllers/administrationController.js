'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;

controller.show = (req, res) => {
    
    res.render('administration', { 
        title: "ShareBug - Administration", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/administration-view.css" />`,
        d3: "selected-menu-item", 
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