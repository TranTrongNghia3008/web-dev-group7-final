'use strict';

const controller = {};
const tagModel = require('../models/tagModel');

const { sanitizeInput } = require('./shared');

controller.addTag = async (req, res) => {
    try {
        const { Name, TestCaseID } = req.body;

        if (!Name || !TestCaseID) {
            return res.status(400).json({ message: 'Name and TestCaseID are required' });
        }

        const newTag = new tagModel({
            Name: Name,
            TestCaseID: TestCaseID
        });

        await newTag.save();

        res.status(200).json({ message: 'Tag added successfully!' });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).json({ message: 'Error adding tag', error });
    }
};

module.exports = controller;