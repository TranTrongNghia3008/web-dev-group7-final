'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('requirement', { 
        title: "ShareBug - Requirement", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`,
        d2: "selected-menu-item", 
        n2: "active border-danger"
    });
}

controller.showImport = (req, res) => {
    
    res.render('requirement-import', { 
        title: "ShareBug - Requirement Import", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`,
        d2: "selected-menu-item", 
        n2: "active border-danger"
    });
}




module.exports = controller;