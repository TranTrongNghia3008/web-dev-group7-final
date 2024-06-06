'use strict';

const controller = {};

const testCaseModel = require('../models/testCaseModel');
const projectModel = require('../models/projectModel');
const testRunModel = require('../models/testRunModel');
const issueModel = require('../models/issueModel');
const userModel = require('../models/userModel');
const reportModel = require('../models/reportModel');
const moduleModel = require('../models/moduleModel');
const activityModel = require('../models/activityModel'); 
const mongoose = require('mongoose');

async function getCollectionSize(collectionName) {
    const stats = await mongoose.connection.db.command({ collStats: collectionName });
    return stats.size;
}
function formatSize(sizeInBytes) {
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB < 1024) {
        return sizeInKB.toFixed(2) + ' KB';
    } else {
        const sizeInMB = sizeInKB / 1024;
        return sizeInMB.toFixed(2) + ' MB';
    }
}
controller.show = async (req, res) => {
    try {
        const projectId = req.query.projectId;
        let countTestCase = await testCaseModel.countDocuments();
        let countProject = await projectModel.countDocuments();
        let countTestRun = await testRunModel.countDocuments();
        let countIssue = await issueModel.countDocuments();
        let countUser = await userModel.countDocuments();

        let countTestCaseProject, countTestRunProject, countIssueProject, countReportProject;
        let projectName;
        let modules, moduleIds;

        if (projectId && projectId !== '0') {w
            const projectIdObj = new mongoose.Types.ObjectId(projectId);

            // Lấy danh sách Module có ProjectID là projectIdObj
            modules = await moduleModel.find({ ProjectID: projectIdObj });
            moduleIds = modules.map(module => module._id);

            const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
            countTestCaseProject = testCases.length;

            const testCaseIds = testCases.map(testCase => testCase._id);
            const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
            countTestRunProject = testRuns.length;

            const testRunIds = testRuns.map(testRun => testRun._id);
            countIssueProject = await issueModel.countDocuments({ TestRunID: { $in: testRunIds } });

            countReportProject = await reportModel.countDocuments({ ProjectID: projectIdObj });

            const project = await projectModel.findById(projectIdObj).select('Name');
            projectName = project.Name;
        } else {
            modules = await moduleModel.find();
            moduleIds = modules.map(module => module._id);
            countTestCaseProject = countTestCase;
            countTestRunProject = countTestRun;
            countIssueProject = countIssue;
            countReportProject = await reportModel.countDocuments();
            projectName = "";
        }

        // let testCases = await testCaseModel.find({});
        let projects = await projectModel.find({});
        // let testRuns = await testRunModel.find({});
        // let issues = await issueModel.find({});
        // let users = await userModel.find({});

        // Tính tổng dung lượng
        let testCaseSize = await getCollectionSize('testcases');
        let projectSize = await getCollectionSize('projects');
        let testRunSize = await getCollectionSize('testruns');
        let issueSize = await getCollectionSize('issues');
        let userSize = await getCollectionSize('users');

        let totalSize = testCaseSize + projectSize + testRunSize + issueSize + userSize;
        let formattedTotalSize = formatSize(totalSize);

        let activities = await activityModel.find({ ModuleID: { $in: moduleIds } });

        activities.forEach(activity => {
            activity.formattedDate = new Date(activity.ActivityDate).toISOString().split('T')[0];
        });

        const activityCountByDate = activities.reduce((acc, activity) => {
            // Đảm bảo ActivityDate là chuỗi
            const date =  activity.formattedDate;
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {});
        
        const labels = Object.keys(activityCountByDate); // Danh sách các ngày
        const data = Object.values(activityCountByDate); // Số lượng activities tương ứng với mỗi ngày
        
        console.log (labels);
        console.log(data);

        // Gửi dữ liệu tới view
        res.render('dashboard', {
            title: "ShareBug - Dashboard",
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                     <link rel="stylesheet" href="/css/dashboard-styles.css" />`,
            d1: "selected-menu-item",
            countTestCase: countTestCase,
            countProject: countProject,
            countTestRun: countTestRun,
            countIssue: countIssue,
            countUser: countUser,
            totalSize: formattedTotalSize,
            projects: projects,
            countTestCaseProject: countTestCaseProject,
            countTestRunProject: countTestRunProject,
            countIssueProject: countIssueProject,
            countReportProject: countReportProject,
            projectName: projectName,
            activities: activities,
            labels: JSON.stringify(labels),
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = controller;
