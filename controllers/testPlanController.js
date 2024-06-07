'use strict';

const controller = {};
const testPlanModel = require('../models/testPlanModel');
const requirementModel = require('../models/requirementModel');
const releaseModel = require('../models/releaseModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Tìm release thuộc project đó
        const releases = await releaseModel.find({ ProjectID: projectId });
        const releaseIds = releases.map(release => release._id);

        // Tìm requirement thuộc các release đó
        const requirements = await requirementModel.find({ ReleaseID: { $in: releaseIds } });
        const requirementIds = requirements.map(requirement => requirement._id);
        
        // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc project đó
        const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds } });

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            TestPlans: testPlans
        };

        // Gọi view và truyền dữ liệu vào
        res.render('test-plan', { 
            title: "ShareBug - Test Plans", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-view-styles.css" />`,
            d2: "selected-menu-item", 
            n7: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test plans:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;
