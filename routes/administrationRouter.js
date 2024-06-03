'use strict';

const express = require('express');
const controller = require('../controllers/administrationController');
const router = express.Router();



router.get('/', controller.show);
router.get('/add-user', controller.showAddUser);




module.exports = router;