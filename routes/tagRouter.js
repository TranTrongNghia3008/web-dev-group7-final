'use strict';

const express = require('express');
const controller = require('../controllers/tagController');
const router = express.Router({ mergeParams: true });

router.post('/', controller.addTag);
router.put('/', controller.editTag);

module.exports = router;