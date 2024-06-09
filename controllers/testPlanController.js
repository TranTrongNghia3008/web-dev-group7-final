'use strict';

const controller = {};
const testPlanModel = require('../models/testPlanModel');
const requirementModel = require('../models/requirementModel');
const releaseModel = require('../models/releaseModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        let testPlanKeyword = req.query.testPlanKeyword || '';

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
            TestPlans: testPlans.slice(skip, skip + limit)
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
