'use strict';

const controller = {};

const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');
const testPlanModel = require('../models/testPlanModel');
const testRunModel = require('../models/testRunModel');
const tagModel = require('../models/tagModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const moduleId = req.query.ModuleID ? req.query.ModuleID : 0;
        let testCaseCount = req.query.TestCaseCount ? req.query.TestCaseCount : 0;
        let testCaseKeyword = req.query.testCaseKeyword || '';
        let moduleKeyword = req.query.moduleKeyword || '';

        // Lấy các tham số sắp xếp từ query params
        const sortField = req.query.sortField || 'created-date';
        const sortOrder = req.query.sortOrder || 'desc';
        const sortCriteria = {};
        if (sortField === 'created-date') {
            sortCriteria.CreatedAt = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'title') {
            sortCriteria.Title = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'case-code') {
            sortCriteria._id = sortOrder === 'desc' ? -1 : 1;
        }


        let modules = await moduleModel.find({ ProjectID: projectId, Name: { $regex: moduleKeyword, $options: 'i' } });

        const moduleIds = modules.map(module => module._id);

        
        const allTestCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });

        let testCases, moduleName;
        if (moduleId !== 0) {
            // Nếu moduleId khác 0, chỉ lấy các test case có moduleId tương ứng
            testCases = await testCaseModel.find({ ModuleID: moduleId, Title: { $regex: testCaseKeyword, $options: 'i' } }).sort(sortCriteria);
            const module = await moduleModel.findById(moduleId).select('Name');
            moduleName = module.Name;
        } else {
            // Nếu moduleId là 0, lấy tất cả các test case
            testCases = await testCaseModel.find({ Title: { $regex: testCaseKeyword, $options: 'i' } }).sort(sortCriteria);
            moduleName = "All Test Cases";
            testCaseCount = allTestCases.length;
        }

        // Lấy số lượng test case cho mỗi module
        const testCaseCounts = await testCaseModel.aggregate([
            { $match: { ModuleID: { $in: moduleIds } } },
            { $group: { _id: "$ModuleID", count: { $sum: 1 } } }
        ]);

        const testCaseCountsMap = testCaseCounts.reduce((map, testCaseCount) => {
            map[testCaseCount._id] = testCaseCount;
            return map;
        }, {});


        const modulesWithTestCaseCount = modules.map(module => {
            return {
                ...module._doc, // spread the document properties
                TestCaseCount: testCaseCountsMap[module._id] ? testCaseCountsMap[module._id].count : 0 // Assuming 'name' is the field in userAssign model
            };
        });

        // // Tìm tất cả các test case thuộc các module
        // const testCasesFromModules = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
        // testCasesFromModules.forEach(testCase => {
        //     testCaseIdsSet.add(testCase._id.toString()); // Chuyển đổi ID sang chuỗi để tránh sự khác biệt trong so sánh
        // });

        // // Chuyển lại set thành mảng các ID test case
        // const uniqueTestCaseIds = Array.from(testCaseIdsSet);

        // // Tìm tất cả các test case dựa trên các ID duy nhất đã thu thập
        // const testCases = await testCaseModel.find({ _id: { $in: uniqueTestCaseIds } });

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
            TotalTestCase: testCases.length,
            ModuleID: moduleId,
            moduleName: moduleName,
            testCaseCount: testCaseCount,
            testCaseTotal: allTestCases.length,
            TestCases: testCases.slice(skip, skip + limit),
            Modules: JSON.stringify(modulesWithTestCaseCount),
            sortField,
            sortOrder
        };


        // Gọi view và truyền dữ liệu vào
        res.render('test-case', { 
            title: "ShareBug - Test Cases", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData,
            // modules: JSON.stringify(modulesWithTestCaseCount)
        });
    } catch (error) {
        console.error('Error fetching test cases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showDetail = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const moduleId = req.query.ModuleID ? req.query.ModuleID : 0;
        let testCaseCount = req.query.TestCaseCount ? req.query.TestCaseCount : 0;
        let testCaseKeyword = req.query.testCaseKeyword || '';
        let moduleKeyword = req.query.moduleKeyword || '';

        // Lấy các tham số sắp xếp từ query params
        const sortField = req.query.sortField || 'created-date';
        const sortOrder = req.query.sortOrder || 'desc';
        const sortCriteria = {};
        if (sortField === 'created-date') {
            sortCriteria.CreatedAt = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'title') {
            sortCriteria.Title = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'case-code') {
            sortCriteria._id = sortOrder === 'desc' ? -1 : 1;
        }


        let modules = await moduleModel.find({ ProjectID: projectId, Name: { $regex: moduleKeyword, $options: 'i' } });

        const moduleIds = modules.map(module => module._id);

        
        const allTestCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });

        let testCases, moduleName;
        if (moduleId !== 0) {
            // Nếu moduleId khác 0, chỉ lấy các test case có moduleId tương ứng
            testCases = await testCaseModel.find({ ModuleID: moduleId, Title: { $regex: testCaseKeyword, $options: 'i' } }).sort(sortCriteria);
            const module = await moduleModel.findById(moduleId).select('Name');
            moduleName = module.Name;
        } else {
            // Nếu moduleId là 0, lấy tất cả các test case
            testCases = await testCaseModel.find({ Title: { $regex: testCaseKeyword, $options: 'i' } }).sort(sortCriteria);
            moduleName = "All Test Cases";
            testCaseCount = allTestCases.length;
        }

        // Lấy số lượng test case cho mỗi module
        const testCaseCounts = await testCaseModel.aggregate([
            { $match: { ModuleID: { $in: moduleIds } } },
            { $group: { _id: "$ModuleID", count: { $sum: 1 } } }
        ]);

        const testCaseCountsMap = testCaseCounts.reduce((map, testCaseCount) => {
            map[testCaseCount._id] = testCaseCount;
            return map;
        }, {});


        const modulesWithTestCaseCount = modules.map(module => {
            return {
                ...module._doc, // spread the document properties
                TestCaseCount: testCaseCountsMap[module._id] ? testCaseCountsMap[module._id].count : 0 // Assuming 'name' is the field in userAssign model
            };
        });

        // // Tìm tất cả các test case thuộc các module
        // const testCasesFromModules = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
        // testCasesFromModules.forEach(testCase => {
        //     testCaseIdsSet.add(testCase._id.toString()); // Chuyển đổi ID sang chuỗi để tránh sự khác biệt trong so sánh
        // });

        // // Chuyển lại set thành mảng các ID test case
        // const uniqueTestCaseIds = Array.from(testCaseIdsSet);

        // // Tìm tất cả các test case dựa trên các ID duy nhất đã thu thập
        // const testCases = await testCaseModel.find({ _id: { $in: uniqueTestCaseIds } });

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
        
        const testCaseId = req.params.testCaseId;
        const testCaseDetail = await testCaseModel.findOne({ _id: testCaseId });

        const moduleDetail = await moduleModel.findOne({ _id: testCaseDetail.ModuleID });
        const testPlanDetail = await testPlanModel.findOne({ _id: testCaseDetail.TestPlanID });
        
        const testRunDetail = await testRunModel.find({ TestCaseID: testCaseId });
        const tags = await tagModel.find({ TestCaseID: testCaseId });

        testCaseDetail.Module = moduleDetail;
        testCaseDetail.TestPlan = testPlanDetail;
        testCaseDetail.TestRuns = testRunDetail;
        testCaseDetail.Tags = tags;

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            TotalTestCase: testCases.length,
            ModuleID: moduleId,
            moduleName: moduleName,
            testCaseCount: testCaseCount,
            testCaseTotal: allTestCases.length,
            TestCases: testCases.slice(skip, skip + limit),
            Modules: JSON.stringify(modulesWithTestCaseCount),
            TestCaseDetail: testCaseDetail,
            sortField,
            sortOrder
        };


        // Gọi view và truyền dữ liệu vào
        res.render('test-case', { 
            title: "ShareBug - Test Cases", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`, 
            d2: "selected-menu-item", 
            n5: "active border-danger",
            project: projectData,
            // modules: JSON.stringify(modulesWithTestCaseCount)
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
