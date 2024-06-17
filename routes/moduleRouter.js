'use strict';

const express = require('express');
const controller = require('../controllers/moduleController');
const router = express.Router({ mergeParams: true });



router.get('/', controller.show);
router.get('/children/:moduleId', controller.getChildModules);

router.post('/updateOrder', controller.updateOrder);
router.post('/children/:moduleId/updateOrder', controller.updateOrderChildModules);
router.post('/', controller.addModule);
router.delete('/:moduleId', controller.deleteModule);



module.exports = router;