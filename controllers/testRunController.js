'use strict';

const controller = {};
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

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            TestRuns: testRunsWithUser
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

        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = testRuns.map(testRun => testRun.AssignTo);

        // Tìm thông tin người được giao từ bảng user
        const usersFull = await userModel.find({});
        const users = await userModel.find({ _id: { $in: assignToIds } });
        const userMap = users.reduce((map, user) => {
            map[user._id] = user;
            return map;
        }, {});

        // Tạo một map từ testCaseId đến các test runs tương ứng
        const testRunMap = testRuns.reduce((map, testRun) => {
            if (!map[testRun.TestCaseID]) {
                map[testRun.TestCaseID] = [];
            }
            map[testRun.TestCaseID].push(testRun);
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

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            Users: usersFull,
            TestCases: testCasesFull
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
