'use strict';

const express = require('express');
const controller = require('../controllers/issueController');
const router = express.Router();



router.get('/', controller.show);




module.exports = router;