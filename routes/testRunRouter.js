'use strict';

const express = require('express');
const controller = require('../controllers/testRunController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get('/:page', controller.show);
router.get('/result', controller.showResult);




module.exports = router;