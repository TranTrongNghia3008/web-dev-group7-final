'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('dashboard', { title: "ShareBug - Dashboard", d1: "selected-menu-item"});
}


module.exports = controller;