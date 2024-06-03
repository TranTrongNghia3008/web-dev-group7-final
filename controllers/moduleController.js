'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('module', { 
        title: "ShareBug - Modules", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/modules-view.css" />`, 
        d2: "selected-menu-item", 
        n4: "active border-danger"
    });
}



module.exports = controller;