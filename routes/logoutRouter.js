'use strict';

const express = require('express');
const controller = require('../controllers/logoutController');
const router = express.Router({ mergeParams: true });


router.get('/', controller.logout);


module.exports = router;