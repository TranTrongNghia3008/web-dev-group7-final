'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('issue', { 
        title: "ShareBug - Issues", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/issues-view-styles.css" />`,
        d2: "selected-menu-item", 
        n8: "active border-danger"
    });
}

module.exports = controller;
