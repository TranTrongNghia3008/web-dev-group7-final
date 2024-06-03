'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.showList = (req, res) => {
    
    res.render('project-list', { 
        title: "ShareBug - Project list", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/project-list.css" />`, 
        d2: "selected-menu-item"
    });
}

controller.showHome = (req, res) => {
    
    res.render('project-home', { 
        title: "ShareBug - Project home", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/project-home.css" />`, 
        d2: "selected-menu-item", 
        n1: "active border-danger"
    });
}


module.exports = controller;