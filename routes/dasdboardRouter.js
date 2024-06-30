'use strict';

const express = require('express');
const controller = require('../controllers/dashboardController');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');



router.get('/', ensureAuthenticated,  controller.show);


module.exports = router;