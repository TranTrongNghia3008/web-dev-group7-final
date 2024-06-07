'use strict';

const express = require('express');
const controller = require('../controllers/issueController');
const router = express.Router();



router.get('/', controller.show);
router.get('/:page', controller.show);



module.exports = router;