'use strict';

const express = require('express');
const controller = require('../controllers/testCaseController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);
router.get('/add-case-BDD', controller.showAddBDD);
router.get('/import', controller.showImport);
router.get('/import-category', controller.showImportCategory);
router.get('/:testCaseId', controller.showDetail);
router.get(':page', controller.show);

router.post('/', controller.addTestCaseStep);
router.put('/', controller.editTestCase);
router.delete('/:testCaseId', controller.deleteTestCase);


module.exports = router;