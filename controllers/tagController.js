'use strict';

const controller = {};
const tagModel = require('../models/tagModel');

const { sanitizeInput } = require('./shared');

controller.addTag = async (req, res) => {
    try {
        const { Name: nameBody, TestCaseID } = req.body;

        // Sanitize each input
        const Name = sanitizeInput(nameBody);

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

controller.editTag = async (req, res) => {
    try {
        const { Name: nameBody, TestCaseID } = req.body;

        // Sanitize each input
        const Name = sanitizeInput(nameBody);

        if (!Name || !TestCaseID) {
            return res.status(400).json({ message: 'Name and TestCaseID are required' });
        }

        let tag = await tagModel.findOne({ Name: Name, TestCaseID: TestCaseID });

        if (!tag) {
            tag = new tagModel({
                Name: Name,
                TestCaseID: TestCaseID
            });
        }

        await tag.save();

        res.status(200).json({ message: 'Tag created or updated successfully!', tag });
    } catch (error) {
        console.error('Error creating or finding tag:', error);
        res.status(500).json({ message: 'Error creating or finding tag', error });
    }
};

module.exports = controller;