'use strict';

const express = require('express');
const controller = require('../controllers/releaseController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);
router.get('/:releaseId', controller.showDetail);
router.get(":page", controller.show);

router.get('/:releaseId/name', controller.getReleaseNameById);

module.exports = router;