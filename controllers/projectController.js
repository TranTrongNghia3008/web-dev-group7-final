'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.showList = (req, res) => {
    
    res.render('project-list', { title: "ShareBug - Project list", d2: "selected-menu-item"});
}

controller.showHome = (req, res) => {
    
    res.render('project-home', { title: "ShareBug - Project home", d2: "selected-menu-item", n1: "active border-danger"});
}


module.exports = controller;