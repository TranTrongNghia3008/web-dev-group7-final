'use strict';

const express = require('express');
const controller = require('../controllers/testCaseController');
const router = express.Router({ mergeParams: true });
const uploadCSV = require('../middlewares/uploadCSV');

router.get('/', controller.show);
router.get('/add-case-BDD', controller.showAddBDD);
router.get('/import', controller.showImport);
router.get('/export', controller.exportTestCase);
router.get('/downloadSample', controller.downloadSampleTestCase);
router.get('/import-category', controller.showImportCategory);
router.get('/:testCaseId', controller.showDetail);
router.get(':page', controller.show);

router.post('/', controller.addTestCaseStep);
router.put('/', controller.editTestCase);
router.delete('/:testCaseId', controller.deleteTestCase);

router.post('/import', uploadCSV, controller.importTestCase);

module.exports = router;