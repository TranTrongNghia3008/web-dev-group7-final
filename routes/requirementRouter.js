'use strict';

const express = require('express');
const controller = require('../controllers/requirementController');
const router = express.Router({ mergeParams: true });


router.get('/', controller.show);
router.get('/import', controller.showImport);
router.get('/:page', controller.show);


module.exports = router;