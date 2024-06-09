'use strict';

const controller = {};
const testRunModel = require('../models/testRunModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');
const userModel = require('../models/userModel');
const issueModel = require('../models/issueModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        let testRunKeyword = req.query.testRunKeyword || '';
        let selectedReleaseId = req.query.selectedReleaseId || '';

        const allReleases = await releaseModel.find({ ProjectID: projectId });

        // Tìm tất cả các module thuộc project đó
        const modules = await moduleModel.find({ ProjectID: projectId });
        const moduleIds = modules.map(module => module._id);

        let testCases, releaseName;
        if (selectedReleaseId && selectedReleaseId != '0') {
            const release = await releaseModel.findById(selectedReleaseId).select('Name');
            releaseName = release.Name;

            const requirements = await requirementModel.find({ ReleaseID: selectedReleaseId });
            const requirementIds = requirements.map(requirement => requirement._id);

            // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc dự án đó
            const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds } });
            const testPlanIds = testPlans.map(testPlan => testPlan._id);


            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
                TestPlanID: { $in: testPlanIds } 
            });
        } else {
            releaseName = "";
            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
            });
        }
               
        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds },  Name: { $regex: testRunKeyword, $options: 'i' } });

        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = testRuns.map(testRun => testRun.AssignTo);
    
        const createdByIds = testRuns.map(testRun => testRun.CreatedBy);

        // Tìm thông tin người được giao từ bảng user
        const userAssigns = await userModel.find({ _id: { $in: assignToIds } });
        const userAssignMap = userAssigns.reduce((map, userAssign) => {
            map[userAssign._id] = userAssign;
            return map;
        }, {});


        // Tìm thông tin người được giao từ bảng user
        const userCreates = await userModel.find({ _id: { $in: createdByIds } });
        const userCreatedMap = userCreates.reduce((map, userCreated) => {
            map[userCreated._id] = userCreated;
            return map;
        }, {});

        // Kết hợp dữ liệu test run với thông tin người được giao
        const testRunsWithUser = testRuns.map(testRun => {
            return {
                ...testRun._doc, // spread the document properties
                AssignTo: userAssignMap[testRun.AssignTo] ? userAssignMap[testRun.AssignTo].Name : 'Unknown', // Assuming 'name' is the field in userAssign model
                CreatedBy: userCreatedMap[testRun.CreatedBy] ? userCreatedMap[testRun.CreatedBy].Name : 'Unknown' // Assuming 'name' is the field in userAssign model
            };
        });

        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
        let total = testRunsWithUser.length;
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
            releaseName: releaseName,
            TestRuns: testRunsWithUser.slice(skip, skip + limit),
            TestRunsCount: testRunsWithUser.length,
            Releases: allReleases
        };

        // Gọi các view cần thiết và truyền dữ liệu vào
        res.render('test-run', { 
            title: "ShareBug - Test Runs", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-view-styles.css" />`,
            d2: "selected-menu-item", 
            n6: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test runs:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Hàm getStatusColor để trả về màu tương ứng với trạng thái
function getStatusColor(status) {
    switch (status) {
        case 'Passed':
            return 'rgb(92, 184, 92)';
        case 'Untested':
            return 'rgb(70, 191, 189)';
        case 'Blocked':
            return 'rgb(77, 83, 96)';
        case 'Retest':
            return 'rgb(253, 180, 92)';
        case 'Failed':
            return 'rgb(247, 70, 74)';
        case 'Not Applicable':
            return 'rgb(147, 119, 85)';
        case 'In Progress':
            return 'rgb(87, 147, 243)';
        case 'Hold':
            return 'rgb(23, 162, 184)';
        default:
            return 'rgb(0, 0, 0)'; // Màu mặc định nếu không có trạng thái nào khớp
    }
}

controller.showResult = async (req, res) => {
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
        const allTestCaseIds = allTestCases.map(allTestCase => allTestCase._id);

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

        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });

        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = testRuns.map(testRun => testRun.AssignTo);

        // Tìm thông tin người được giao từ bảng user
        const usersFull = await userModel.find({});
        const users = await userModel.find({ _id: { $in: assignToIds } });
        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});


        // Kết hợp dữ liệu test case với thông tin test run và người được giao
        const testCasesFull = testCases.map(testCase => {
            const runs = testRuns.filter(run => run.TestCaseID.toString() === testCase._id.toString());
            const testRunsInfo = runs.map(run => ({
                Status: run.Status,
                AssignTo: userMap[run.AssignTo] ? userMap[run.AssignTo].Name : 'Unknown' // Assuming 'Name' is the field in user model
            }));

            // Lấy thông tin người được giao và trạng thái từ testRunsInfo
            const assignTo = testRunsInfo.length > 0 ? testRunsInfo[0].AssignTo : 'Unknown';
            const status = testRunsInfo.length > 0 ? testRunsInfo[0].Status : 'Untested';

            // Trả lại testCase đã được cập nhật
            return {
                ...testCase._doc, // spread the document properties
                AssignTo: assignTo,
                Status: status,
                StatusColor: getStatusColor(status) // Lấy màu cho trạng thái
            };
        });

        
        const allTestRuns = await testRunModel.find({ TestCaseID: { $in: allTestCaseIds } });
        // Đếm số lượng test run theo status
        const projectStatus = ['Passed', 'Untested', 'Blocked', 'Retest', 'Failed', 'Not Applicable', 'In Progress', 'Hold'];
        const numProjectStatus = projectStatus.map(status => {
            return allTestRuns.filter(allTestRun => allTestRun.Status === status).length;
        });

        const allTestRunIds = allTestRuns.map(allTestRun => allTestRun._id);


        const allIssues = await issueModel.find({ TestRunID: { $in: allTestRunIds } });
        // Đếm số lượng test run theo status
        const issueStatus = ['New', 'Assigned', 'Open', 'Fixed', 'Retest', 'Verified', 'Reopen', 'Closed', 'Duplicate', 'Invalid', 'Deferred']
        const numIssueStatus = issueStatus.map(status => {
            return allIssues.filter(allIssue => allIssue.Status === status).length;
        });
        
        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
        let total = testCasesFull.length;
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
            Users: usersFull,
            TestCases: testCasesFull.slice(skip, skip + limit),
            TotalTestCase: allTestCases.length,
            ModuleID: moduleId,
            moduleName: moduleName,
            testCaseCount: testCasesFull.length,
            Modules: JSON.stringify(modulesWithTestCaseCount),
            numProjectStatus: numProjectStatus,
            numIssueStatus: numIssueStatus,
            sortField,
            sortOrder
        };

        // Gọi các view cần thiết và truyền dữ liệu vào
        res.render('test-run-result', { 
            title: "ShareBug - Test Runs & Results", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/test-runs-results-styles.css" />`,
            d2: "selected-menu-item", 
            n6: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching test runs:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;
