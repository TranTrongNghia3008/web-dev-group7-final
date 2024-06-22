'use strict';

const express = require('express');
const controller = require('../controllers/administrationController');
const router = express.Router();
const upload = require('../middlewares/upload');



router.get('/', controller.show);
router.get('/add-user', controller.showAddUser);
router.get('/:page', controller.show);

//router.get('/:sortby:order', controller.show);

router.post('/', upload, controller.addUser);
router.put('/', upload, controller.editUser);
router.delete('/:id', controller.deleteUser);


module.exports = router;