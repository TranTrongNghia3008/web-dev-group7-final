'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;

controller.show = (req, res) => {
    
    res.render('report', { 
        title: "ShareBug - Reports", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/reports-view.css" />`,
        d2: "selected-menu-item", 
        n9: "active border-danger"
    });
}

controller.showAdd = (req, res) => {
    
    res.render('report-add', { 
        title: "ShareBug - Add Report", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/reports-add.css" />`,
        d2: "selected-menu-item", 
        n9: "active border-danger"
    });
}

module.exports = controller;