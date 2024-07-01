'use strict';

const express = require('express');
const controller = require('../controllers/projectController');
const router = express.Router();

router.get('/list', controller.showList);
router.get('/list/:page', controller.showList);
router.get('/:projectId', controller.showHome);

router.post('/list/assignUser', controller.assignUser);
router.delete('/removeAssignUser/:id', controller.removeAssignUser);

router.use('/:projectId/requirement', require('./requirementRouter'));
router.use('/:projectId/release', require('./releaseRouter'));
router.use('/:projectId/module', require('./moduleRouter'));
router.use('/:projectId/test-case', require('./testCaseRouter'));
router.use('/:projectId/test-run', require('./testRunRouter'));
router.use('/:projectId/test-plan', require('./testPlanRouter'));
router.use('/:projectId/issue', require('./issueRouter'));
router.use('/:projectId/report', require('./reportRouter'));

module.exports = router;