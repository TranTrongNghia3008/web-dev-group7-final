'use strict';

const express = require('express');
const controller = require('../controllers/requirementController');
const router = express.Router({ mergeParams: true });
const uploadCSV = require('../middlewares/uploadCSV');

router.get('/', controller.show);
router.get('/import', controller.showImport);
router.get('/export', controller.exportRequirement);
router.get('/:page', controller.show);

router.post('/', controller.addRequirement);
router.put('/', controller.editRequirement);
router.delete('/:requirementId', controller.deleteRequirement);

router.post('/import', uploadCSV, controller.importRequirement);

module.exports = router;