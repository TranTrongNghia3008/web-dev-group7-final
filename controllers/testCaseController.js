'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('test-case', { 
        title: "ShareBug - Add Case Step", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`, 
        d2: "selected-menu-item", 
        n5: "active border-danger"
    });
}

controller.showAddBDD = (req, res) => {
    
    res.render('test-case-add-case-BDD', { 
        title: "ShareBug - Add Case BDD", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/test-cases-BDD-styles.css" />`, 
        d2: "selected-menu-item", 
        n5: "active border-danger"
    });
}

controller.showImport = (req, res) => {
    
    res.render('test-case-import', { 
        title: "ShareBug - Add Case BDD", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`, 
        d2: "selected-menu-item", 
        n5: "active border-danger"
    });
}

controller.showImportCategory = (req, res) => {
    
    res.render('test-case-import-category', { 
        title: "ShareBug - Add Case BDD", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`, 
        d2: "selected-menu-item", 
        n5: "active border-danger"
    });
}

module.exports = controller;