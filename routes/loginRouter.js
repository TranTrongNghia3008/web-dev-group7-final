'use strict';

const express = require('express');
const controller = require('../controllers/loginController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);

router.post('/', controller.login);


module.exports = router;