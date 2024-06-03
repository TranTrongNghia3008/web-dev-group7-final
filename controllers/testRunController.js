'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('test-run', { 
        title: "ShareBug - Test Runs", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/test-runs-view-styles.css" />`,
        d2: "selected-menu-item", 
        n6: "active border-danger"
    });
}

controller.showResult = (req, res) => {
    
    res.render('test-run-result', { 
        title: "ShareBug - Test Runs & Results", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`,
        d2: "selected-menu-item", 
        n6: "active border-danger"
    });
}




module.exports = controller;