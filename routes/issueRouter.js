'use strict';

const express = require('express');
const controller = require('../controllers/issueController');
const router = express.Router({ mergeParams: true });
const uploadCSV = require('../middlewares/uploadCSV');

router.get('/', controller.show);
router.get('/import', controller.showImport);
router.get('/export', controller.exportIssue);
router.get('/downloadSample', controller.downloadSampleIssue);
router.get('/:issueId', controller.showDetail);
router.get(':page', controller.show);

router.post('/', controller.addIssue);
router.put('/', controller.editIssue);
router.delete('/:id', controller.deleteIssue);

router.post('/import', uploadCSV, controller.importIssue);

router.put('/bulkActions', controller.bulkActions);

module.exports = router;