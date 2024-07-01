'use strict';

const express = require('express');
const controller = require('../controllers/testPlanController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);
router.get('/:page', controller.show);

router.get('/:testPlanId/name', controller.getTestPlanNameById);

router.post('/', controller.addTestPlan);
router.put('/', controller.editTestPlan);
router.delete('/:testPlanId', controller.deleteTestPlan);

module.exports = router;