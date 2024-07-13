'use strict';

const express = require('express');
const controller = require('../controllers/administrationController');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadCSV = require('../middlewares/uploadCSV');


router.get('/', controller.show);
router.get('/add-user', controller.showAddUser);
router.get('/import', controller.showImport);
router.get('/export', controller.exportUser);
router.get('/downloadSample', controller.downloadSampleRequirement);
router.get('/:page', controller.show);

//router.get('/:sortby:order', controller.show);

router.post('/', upload, controller.addUser);
router.put('/', upload, controller.editUser);
router.delete('/:id', controller.deleteUser);

router.post('/import', uploadCSV, controller.importUser);

module.exports = router;