'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('test-plan', { 
        title: "ShareBug - Test Plans", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/test-runs-view-styles.css" />`,
        d2: "selected-menu-item", 
        n7: "active border-danger"
    });
}


module.exports = controller;