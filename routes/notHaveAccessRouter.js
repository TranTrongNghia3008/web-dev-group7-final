'use strict';

const express = require('express');
const controller = require('../controllers/notHaveAccessController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);



module.exports = router;