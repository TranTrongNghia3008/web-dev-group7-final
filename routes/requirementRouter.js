'use strict';

const express = require('express');
const controller = require('../controllers/requirementController');
const router = express.Router({ mergeParams: true });


router.get('/', controller.show);
router.get('/import', controller.showImport);
router.get('/:page', controller.show);

router.post('/', controller.addRequirement);
router.put('/', controller.editRequirement);
router.delete('/:requirementId', controller.deleteRequirement);

module.exports = router;