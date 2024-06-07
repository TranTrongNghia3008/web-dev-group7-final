'use strict';

const express = require('express');
const controller = require('../controllers/testCaseController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get('/:testCaseId', controller.showDetail);
router.get('/add-case-BDD', controller.showAddBDD);
router.get('/import', controller.showImport);
router.get('/import-category', controller.showImportCategory);




module.exports = router;