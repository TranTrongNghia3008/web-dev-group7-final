'use strict';

const express = require('express');
const controller = require('../controllers/requirementController');
const router = express.Router();



router.get('/', controller.show);
router.get('/import', controller.showImport);



module.exports = router;