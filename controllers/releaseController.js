'use strict';

const controller = {};
// const { where } = require('sequelize');
// const models = require('../models');
// const sequelize = require('sequelize');
// const Op = sequelize.Op;
controller.show = (req, res) => {
    
    res.render('release', { 
        title: "ShareBug - Release", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/release.css" />`,
        d2: "selected-menu-item", 
        n3: "active border-danger"
    });
}



module.exports = controller;