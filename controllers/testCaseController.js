'use strict';

const controller = {};
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');

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

        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
        let total = testCases.length;
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
            TestCases: testCases.slice(skip, skip + limit)
        };

        // Gọi view và truyền dữ liệu vào
        res.render('test-case', { 
            title: "ShareBug - Add Case Step", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showAddBDD = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId
        };

        // Gọi các view cần thiết và truyền dữ liệu vào
        res.render('test-case-add-case-BDD', { 
            title: "ShareBug - Add Case BDD", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/dashboard-styles.css" />
                    <link rel="stylesheet" href="/css/test-cases-BDD-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showImport = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId
        };

        // Gọi các view cần thiết và truyền dữ liệu vào
        res.render('test-case-import', { 
            title: "ShareBug - Add Case BDD", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/dashboard-styles.css" />
                    <link rel="stylesheet" href="/css/requirement-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showImportCategory = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId
        };

        // Gọi các view cần thiết và truyền dữ liệu vào
        res.render('test-case-import-category', { 
            title: "ShareBug - Add Case BDD", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/dashboard-styles.css" />
                    <link rel="stylesheet" href="/css/requirement-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;
