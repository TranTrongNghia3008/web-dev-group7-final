'use strict';

const express = require('express');
const controller = require('../controllers/issueController');
const router = express.Router({ mergeParams: true });

router.get('/', controller.show);
router.get('/:issueId', controller.showDetail);
router.get(':page', controller.show);

router.post('/add', controller.addIssue);
router.post('/edit', controller.editIssue);
router.delete('/:id', controller.deleteIssue);



module.exports = router;