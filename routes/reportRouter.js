'use strict';

const express = require('express');
const controller = require('../controllers/reportController');
const router = express.Router();



router.get('/', controller.show);
router.get('/add', controller.showAdd);




module.exports = router;