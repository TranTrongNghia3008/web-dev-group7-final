'use strict';

const express = require('express');
const controller = require('../controllers/testRunController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get(':page', controller.show);
router.get('/result', controller.showResult);
router.get('/result:page', controller.showResult);
router.put('/result/changeStatus/:testCaseId', controller.changeStatus);
router.put('/result/updateAssignTo/:testCaseId', controller.updateAssignTo);
router.put('/result/bulkActions', controller.bulkActions);

router.post('/', controller.addTestRun);
router.put('/:id', controller.editTestRun);
router.delete('/:id', controller.deleteTestRun);




module.exports = router;