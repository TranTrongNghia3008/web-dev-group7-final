'use strict';

const express = require('express');
const controller = require('../controllers/projectController');
const router = express.Router();



router.get('/list', controller.showList);
router.get('/home', controller.showHome);


module.exports = router;