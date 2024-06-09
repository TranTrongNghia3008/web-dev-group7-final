'use strict';

const express = require('express');
const controller = require('../controllers/administrationController');
const router = express.Router();



router.get('/', controller.show);
router.get('/:page', controller.show);
router.get('/add-user', controller.showAddUser);
//router.get('/:sortby:order', controller.show);




module.exports = router;