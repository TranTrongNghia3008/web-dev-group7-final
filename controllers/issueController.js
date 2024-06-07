'use strict';

const controller = {};
const issueModel = require('../models/issueModel');
const testRunModel = require('../models/testRunModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');
const userModel = require('../models/userModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;


        // Tìm tất cả các module thuộc project đó
        const modules = await moduleModel.find({ ProjectID: projectId });
        const moduleIds = modules.map(module => module._id);

        const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        // Tìm tất cả các issue thuộc các test run thuộc project đó
        const issues = await issueModel.find({ TestRunID: { $in: testRunIds } });

        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = issues.map(issue => issue.AssignedTo);

        const createdByIds = issues.map(issue => issue.CreatedBy);

        // Tìm thông tin người được giao từ bảng user
        const userAssigns = await userModel.find({ _id: { $in: assignToIds } });
        const userAssignMap = userAssigns.reduce((map, userAssign) => {
            map[userAssign._id] = userAssign;
            return map;
        }, {});

        const userCreates = await userModel.find({ _id: { $in: createdByIds } });
        const userCreatedMap = userCreates.reduce((map, userCreated) => {
            map[userCreated._id] = userCreated;
            return map;
        }, {});

        // Kết hợp dữ liệu test run với thông tin người được giao
        const issuesWithUser = issues.map(issue => {
            return {
                ...issue._doc, // spread the document properties
                AssignTo: userAssignMap[issue.AssignedTo] ? userAssignMap[issue.AssignedTo].Name : 'Unknown', // Assuming 'name' is the field in user model
                CreatedBy: userCreatedMap[issue.CreatedBy] ? userCreatedMap[issue.CreatedBy].Name : 'Unknown'
            };
        });

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            Issues: issuesWithUser
        };

        // Gọi view và truyền dữ liệu vào
        res.render('issue', { 
            title: "ShareBug - Issues", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/issues-view-styles.css" />`,
            d2: "selected-menu-item", 
            n8: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;
