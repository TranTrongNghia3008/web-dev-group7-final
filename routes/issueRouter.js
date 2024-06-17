'use strict';

const express = require('express');
const controller = require('../controllers/issueController');
const router = express.Router({ mergeParams: true });

// // Middleware to distinguish between issueId and page
// router.use('/:param', (req, res, next) => {
//     const param = req.params.param;
    
//     // Check if the param is a number (issueId)
//     if (!isNaN(param)) {
//         req.issueId = param;
//     } else {
//         req.page = param;
//     }
//     next();
// });

// router.get('/', controller.show);
// router.get('/:param', (req, res) => {
//     if (req.issueId) {
//         controller.show(req, res, req.issueId);
//     } else if (req.page) {
//         controller.show(req, res, req.page);
//     }
// });

router.get('/', controller.show);
router.get('/:issueId', controller.showDetail);
router.get(':page', controller.show);

router.post('/add', controller.addIssue);
router.post('/edit', controller.editIssue);
router.delete('/:id', controller.deleteIssue);



module.exports = router;