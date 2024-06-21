'use strict';

const express = require('express');
const controller = require('../controllers/reportController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
//router.get('/add', controller.showAdd);
router.get('/:page', controller.show);

router.post('/', controller.addReport);
router.put('/', controller.editReport);
router.delete('/:reportId', controller.deleteReport);



module.exports = router;