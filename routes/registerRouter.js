'use strict';

const express = require('express');
const controller = require('../controllers/registerController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);

router.post('/', controller.register);


module.exports = router;