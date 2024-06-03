'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('requirement', { title: "ShareBug - Requirement", d2: "selected-menu-item", n2: "active border-danger"});
}

controller.showImport = (req, res) => {
    
    res.render('requirement-import', { title: "ShareBug - Requirement Import", d2: "selected-menu-item", n2: "active border-danger"});
}




module.exports = controller;