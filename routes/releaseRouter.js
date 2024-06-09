'use strict';

const express = require('express');
const controller = require('../controllers/releaseController');
const router = express.Router({ mergeParams: true });

// Middleware to distinguish between releaseId and page
router.use('/:param', (req, res, next) => {
    const param = req.params.param;
    
    // Check if the param is a number (releaseId)
    if (!isNaN(param)) {
        req.releaseId = param;
    } else {
        req.page = param;
    }
    next();
});

router.get('/', controller.show);
router.get('/:param', (req, res) => {
    if (req.releaseId) {
        controller.show(req, res, req.releaseId);
    } else if (req.page) {
        controller.show(req, res, req.page);
    }
});


// router.get('/', controller.show);
// router.get('/:releaseId', controller.show);
// router.get("/:page", controller.show);



module.exports = router;