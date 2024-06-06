'use strict';

const controller = {};
// const { where } = require('sequelize');
const testCaseModel = require('../models/testCaseModel');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = async (req, res) => {
    let countTestCase = await testCaseModel.countDocuments();
    console.log("count"+ countTestCase);
    res.locals.countTestCase = countTestCase;
    res.render('dashboard', { 
        title: "ShareBug - Dashboard", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />`, 
        d1: "selected-menu-item"
    });
}


module.exports = controller;