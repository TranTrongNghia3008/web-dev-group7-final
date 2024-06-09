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

        // Tìm tất cả các release thuộc dự án đó
        const releases = await releaseModel.find({ ProjectID: projectId });
        const releaseIds = releases.map(release => release._id);

        // Tìm tất cả các requirement thuộc các release đó
        const requirements = await requirementModel.find({ ReleaseID: { $in: releaseIds } });
        const requirementIds = requirements.map(requirement => requirement._id);

        // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc dự án đó
        const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds } });
        const testPlanIds = testPlans.map(testPlan => testPlan._id);

        // Tìm tất cả các module thuộc project đó
        const modules = await moduleModel.find({ ProjectID: projectId });
        const moduleIds = modules.map(module => module._id);

        // Lưu trữ ID của các test case mà không bị trùng lặp
        const testCaseIdsSet = new Set();

        // Tìm tất cả các test case thuộc các test plan
        const testCasesFromTestPlans = await testCaseModel.find({ TestPlanID: { $in: testPlanIds } });
        testCasesFromTestPlans.forEach(testCase => {
            testCaseIdsSet.add(testCase._id.toString()); // Chuyển đổi ID sang chuỗi để tránh sự khác biệt trong so sánh
        });

        // Tìm tất cả các test case thuộc các module
        const testCasesFromModules = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
        testCasesFromModules.forEach(testCase => {
            testCaseIdsSet.add(testCase._id.toString()); // Chuyển đổi ID sang chuỗi để tránh sự khác biệt trong so sánh
        });

        // Chuyển lại set thành mảng các ID test case
        const uniqueTestCaseIds = Array.from(testCaseIdsSet);

        // Tìm tất cả các test case dựa trên các ID duy nhất đã thu thập
        const testCases = await testCaseModel.find({ _id: { $in: uniqueTestCaseIds } });
        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        // Tìm tất cả các issue thuộc các test run thuộc project đó
        const issues = await issueModel.find({ TestRunID: { $in: testRunIds } });

        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = issues.map(issue => issue.AssignedTo);

        // Tìm thông tin người được giao từ bảng user
        const users = await userModel.find({ _id: { $in: assignToIds } });
        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});

        // Kết hợp dữ liệu test run với thông tin người được giao
        const issuesWithUser = issues.map(issue => {
            return {
                ...issue._doc, // spread the document properties
                AssignTo: userMap[issue.AssignedTo] ? userMap[issue.AssignedTo].Name : 'Unknown' // Assuming 'name' is the field in user model
            };
        });

        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
        let total = issuesWithUser.length;
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
            Issues: issuesWithUser.slice(skip, skip + limit)
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
