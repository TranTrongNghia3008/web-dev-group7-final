'use strict';

const express = require('express');
const controller = require('../controllers/testRunController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get(':page', controller.show);
router.get('/result', controller.showResult);
router.get('/result:page', controller.showResult);

router.post('/add', controller.addTestRun);
router.post('/edit', controller.editTestRun);
router.delete('/:id', controller.deleteTestRun);




module.exports = router;