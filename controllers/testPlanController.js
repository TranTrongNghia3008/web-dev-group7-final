'use strict';

const controller = {};
const testPlanModel = require('../models/testPlanModel');
const requirementModel = require('../models/requirementModel');
const releaseModel = require('../models/releaseModel');
const userModel = require('../models/userModel');

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        let testPlanKeyword = sanitizeInput(req.query.testPlanKeyword) || '';

        // Tìm release thuộc project đó
        const releases = await releaseModel.find({ ProjectID: projectId });
        const releaseIds = releases.map(release => release._id);

        // Tìm requirement thuộc các release đó
        const requirements = await requirementModel.find({ ReleaseID: { $in: releaseIds } });
        const requirementIds = requirements.map(requirement => requirement._id);
        
        // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc project đó
        const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds }, Name: { $regex: testPlanKeyword, $options: 'i' } });

        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
        let total = testPlans.length;
        let showing = Math.min(total, skip + limit);
        res.locals.pagination = 
        {
            page: page,
            limit: limit,
            showing: showing,
            totalRows: total,
            queryParams: req.query
        };


        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            TestPlans: testPlans.slice(skip, skip + limit),
            TestPlansCount: testPlans.length
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });


        // Gọi view và truyền dữ liệu vào
        res.render('test-plan', { 
            title: "ShareBug - Test Plans", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-view-styles.css" />`,
            d2: "selected-menu-item", 
            n7: "active border-danger",
            user,
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test plans:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.getTestPlanNameById = async (req, res) => {
    try {
        const testPlanId = req.params.testPlanId;
        const testPlan = await testPlanModel.findById(testPlanId);
        if (!testPlan) {
            return res.status(404).json({ message: 'TestPlan not found' });
        }
        res.json({ TestPlanName: testPlan.Name });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching testPlan name', error });
    }
};

controller.addTestPlan = async (req, res) => {
    try {
        const {
            name: nameBody,
            startDate: startDateBody,
            endDate: endDateBody,
            description: descriptionBody
        } = req.body;

        // Sanitize inputs
        const name = sanitizeInput(nameBody);
        const startDate = startDateBody;
        const endDate = endDateBody;
        const description = sanitizeInput(descriptionBody);

        const startDay = startDate ? new Date(startDate) : null;
        const endDay = endDate ? new Date(startDate) : null;
        const formattedStartDate = startDay ? startDay.toISOString() : null;
        const formattedEndDate = endDay ? endDay.toISOString() : null;

        const newTestPlan = await testPlanModel.create({
            Name: name,
            StartDate: formattedStartDate,
            EndDate: formattedEndDate,
            Description: description || null,
            RequirementID: "66601c17e78adfc3981db376",
        });

        if (!newTestPlan) {
            return res.status(404).json({ message: 'Test Plan not found' });
        }
        else
            res.status(200).json({ message: 'Test Plan Added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Test Plan', error });
    }
};

controller.editTestPlan = async (req, res) => {
    try {
        const {
            nameEdit: nameBody,
            startDateEdit: startDateBody,
            endDateEdit: endDateBody,
            descriptionEdit: descriptionBody,
            idEdit
        } = req.body;

        // Sanitize inputs
        const nameEdit = sanitizeInput(nameBody);
        const startDateEdit = startDateBody;
        const endDateEdit = endDateBody;
        const descriptionEdit = sanitizeInput(descriptionBody);

        const startDay = startDateEdit ? new Date(startDateEdit) : null;
        const endDay = endDateEdit ? new Date(endDateEdit) : null;
        const formattedStartDate = startDay ? startDay.toISOString() : null;
        const formattedEndDate = endDay ? endDay.toISOString() : null;

        if (nameEdit == "") {
            return res.status(404).json({ message: 'Test Plan name not filled' });
        }

        const updatedTestPlan = await testPlanModel.findByIdAndUpdate(
            idEdit,
            {
                Name: nameEdit,
                StartDate: formattedStartDate,
                EndDate: formattedEndDate,
                Description: descriptionEdit || null,
                UpdatedAt: Date.now()
                // RequirementID: if it is to be updated, include here
            },
        );

        if (!updatedTestPlan) {
            return res.status(404).json({ message: 'Test Plan not found' });
        }
        else
            res.status(200).json({ message: 'Test Plan Updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Test Plan', error });
    }
};

controller.deleteTestPlan = async (req, res) => {
    try {
        const testPlanId = req.params.testPlanId;
        const deletedTestPlan = await testPlanModel.findByIdAndDelete(testPlanId);

        if (!deletedTestPlan) {
            return res.status(404).json({ message: "Test plan not found" });
        }

        res.json({ message: "Test plan deleted successfully", deletedTestPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete test plan", error });
    }
};

module.exports = controller;
