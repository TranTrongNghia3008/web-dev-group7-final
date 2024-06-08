'use strict';

const controller = {};

const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');

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

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            TotalTestCase: allTestCases.length,
            ModuleID: moduleId,
            moduleName: moduleName,
            testCaseCount: testCaseCount,
            TestCases: testCases,
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
