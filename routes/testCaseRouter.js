'use strict';

const express = require('express');
const controller = require('../controllers/testCaseController');
const router = express.Router({ mergeParams: true });

// // Middleware to distinguish between testCaseId and page
// router.use('/:param', (req, res, next) => {
//     const param = req.params.param;
    
//     // Check if the param is a number (testCaseId)
//     if (!isNaN(param)) {
//         req.testCaseId = param;
//     } else {
//         req.page = param;
//     }
//     next();
// });

// router.get('/:param', (req, res) => {
//     if (req.testCaseId) {
//         controller.showDetail(req, res, req.testCaseId);
//     } else if (req.page) {
//         controller.show(req, res, req.page);
//     }
// });


router.get('/', controller.show);
router.get('/:testCaseId', controller.showDetail);
router.get(':page', controller.show);
router.get('/add-case-BDD', controller.showAddBDD);
router.get('/import', controller.showImport);
router.get('/import-category', controller.showImportCategory);




module.exports = router;