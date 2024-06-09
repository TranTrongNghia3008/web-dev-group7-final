'use strict';

const express = require('express');
const controller = require('../controllers/testPlanController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get('/:page', controller.show);



module.exports = router;