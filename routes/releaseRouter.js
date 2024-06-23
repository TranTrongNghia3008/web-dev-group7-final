'use strict';

const express = require('express');
const controller = require('../controllers/releaseController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);
router.get('/:releaseId', controller.showDetail);
router.get(":page", controller.show);

router.get('/:releaseId/name', controller.getReleaseNameById);

router.post('/', controller.addRelease);
router.put('/', controller.editRelease);
router.delete('/:releaseId', controller.deleteRelease);

module.exports = router;