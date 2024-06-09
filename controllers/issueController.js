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

        let issueTitleKeyword = req.query.issueTitleKeyword || '';
        let issueCodeKeyword = req.query.issueCodeKeyword || '';


        const categoryFilter = req.query.category ? req.query.category.split(',') : [];
        const statusFilter = req.query.status ? req.query.status.split(',') : [];
        const priorityFilter = req.query.priority ? req.query.priority.split(',') : [];
        const bugTypeFilter = req.query.bugType ? req.query.bugType.split(',') : [];
        const assigneeFilter = req.query.assignee ? req.query.assignee.split(',') : [];
        const createdByFilter = req.query.createdBy ? req.query.createdBy.split(',') : [];
        const environmentFilter = req.query.environment ? req.query.environment.split(',') : [];
        const releaseFilter = req.query.release ? req.query.release.split(',') : [];
        const moduleFilter = req.query.module ? req.query.module.split(',') : [];

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

        // Tìm tất cả các module thuộc project đó
        const allModules = await moduleModel.find({ ProjectID: projectId });
        let modules;
        if (moduleFilter.length > 0) modules = await moduleModel.find({ ProjectID: projectId, _id: { $in: moduleFilter } })
        else  modules = allModules;
        const moduleIds = modules.map(module => module._id);

        // const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });

        let testCases;
        if (releaseFilter.length > 0) {


            const requirements = await requirementModel.find({ ReleaseID: { $in: releaseFilter } });
            const requirementIds = requirements.map(requirement => requirement._id);

            // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc dự án đó
            const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds } });
            const testPlanIds = testPlans.map(testPlan => testPlan._id);


            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
                TestPlanID: { $in: testPlanIds } 
            });
        } else {
            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
            });
        }
        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        // Tạo đối tượng query cho MongoDB
        let query = { 
            TestRunID: { $in: testRunIds },
            Title: { $regex: issueTitleKeyword, $options: 'i' }
        };

        // Áp dụng các bộ lọc
        if (categoryFilter.length > 0) query.Category = { $in: categoryFilter };
        if (statusFilter.length > 0) query.Status = { $in: statusFilter };
        if (priorityFilter.length > 0) query.Priority = { $in: priorityFilter };
        if (bugTypeFilter.length > 0) query.IssueType = { $in: bugTypeFilter };
        if (assigneeFilter.length > 0) query.AssignedTo = { $in: assigneeFilter };
        if (createdByFilter.length > 0) query.CreatedBy = { $in: createdByFilter };
        if (environmentFilter.length > 0) query.Environment = { $in: environmentFilter };

        const issuesTemp = await issueModel.find(query).sort(sortCriteria);
        
        const issues = issuesTemp.filter(issue => issue._id.toString().includes(issueCodeKeyword));
        


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

        const releases = await releaseModel.find({ ProjectID: projectId });

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
            Issues: issuesWithUser.slice(skip, skip + limit),
            IssuesCount: issuesWithUser.length,
            Modules: allModules,
            UserAssigns: userAssigns,
            UserCreates: userCreates,
            Releases: releases,
            Categories: ['Bug', 'Task', 'Subtask'],
            Status: ['Assigned', 'Closed', 'Deferred', 'Duplicate', 'Fixed', 'Invalid', 'New', 'Open', 'Reopen', 'Retest', 'Verified'],
            Priorities: ['Show stopper', 'High', 'Medium', 'Low'],
            BugTypes: ['Not Applicable', 'UI/Design', 'Performance', 'Validations', 'Functionality', 'SEO', 'Console Error', 'Server Error', 'Tracking'],
            Environments: ['QA', 'Staging', 'Development', 'Production', 'UAT'],
            sortField,
            sortOrder

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

controller.showDetail = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        let issueTitleKeyword = req.query.issueTitleKeyword || '';
        let issueCodeKeyword = req.query.issueCodeKeyword || '';


        const categoryFilter = req.query.category ? req.query.category.split(',') : [];
        const statusFilter = req.query.status ? req.query.status.split(',') : [];
        const priorityFilter = req.query.priority ? req.query.priority.split(',') : [];
        const bugTypeFilter = req.query.bugType ? req.query.bugType.split(',') : [];
        const assigneeFilter = req.query.assignee ? req.query.assignee.split(',') : [];
        const createdByFilter = req.query.createdBy ? req.query.createdBy.split(',') : [];
        const environmentFilter = req.query.environment ? req.query.environment.split(',') : [];
        const releaseFilter = req.query.release ? req.query.release.split(',') : [];
        const moduleFilter = req.query.module ? req.query.module.split(',') : [];

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

        // Tìm tất cả các module thuộc project đó
        const allModules = await moduleModel.find({ ProjectID: projectId });
        let modules;
        if (moduleFilter.length > 0) modules = await moduleModel.find({ ProjectID: projectId, _id: { $in: moduleFilter } })
        else  modules = allModules;
        const moduleIds = modules.map(module => module._id);

        // const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });

        let testCases;
        if (releaseFilter.length > 0) {


            const requirements = await requirementModel.find({ ReleaseID: { $in: releaseFilter } });
            const requirementIds = requirements.map(requirement => requirement._id);

            // Tìm tất cả các test plan thuộc các requirement thuộc các release thuộc dự án đó
            const testPlans = await testPlanModel.find({ RequirementID: { $in: requirementIds } });
            const testPlanIds = testPlans.map(testPlan => testPlan._id);


            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
                TestPlanID: { $in: testPlanIds } 
            });
        } else {
            testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
            });
        }
        const testCaseIds = testCases.map(testCase => testCase._id);

        // Tìm tất cả các test run thuộc các test case thuộc project đó
        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        // Tạo đối tượng query cho MongoDB
        let query = { 
            TestRunID: { $in: testRunIds },
            Title: { $regex: issueTitleKeyword, $options: 'i' }
        };

        // Áp dụng các bộ lọc
        if (categoryFilter.length > 0) query.Category = { $in: categoryFilter };
        if (statusFilter.length > 0) query.Status = { $in: statusFilter };
        if (priorityFilter.length > 0) query.Priority = { $in: priorityFilter };
        if (bugTypeFilter.length > 0) query.IssueType = { $in: bugTypeFilter };
        if (assigneeFilter.length > 0) query.AssignedTo = { $in: assigneeFilter };
        if (createdByFilter.length > 0) query.CreatedBy = { $in: createdByFilter };
        if (environmentFilter.length > 0) query.Environment = { $in: environmentFilter };

        const issuesTemp = await issueModel.find(query).sort(sortCriteria);
        
        const issues = issuesTemp.filter(issue => issue._id.toString().includes(issueCodeKeyword));
        


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

        const releases = await releaseModel.find({ ProjectID: projectId });

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

        const issueId = req.params.issueId;
        const issueDetail = await issueModel.findOne({ _id: issueId });

        const issueUserDetail = await userModel.findOne({ _id: issueDetail.CreatedBy });
        const issueTestRunDetail = await testRunModel.findOne({ _id: issueDetail.TestRunID });
        const issueTestCaseDetail = await testCaseModel.findOne({ _id: issueTestRunDetail.TestCaseID });
        const issueModuleDetail = await moduleModel.findOne({ _id: issueTestCaseDetail.ModuleID });
        const issueTestPlanDetail = await testPlanModel.findOne({ _id: issueTestCaseDetail.TestPlanID });

        let issueReleaseDetail;
        if (issueTestPlanDetail) {
            const issueRequirementDetail = await requirementModel.findOne({ _id: issueTestPlanDetail.RequirementID });
            issueReleaseDetail = await releaseModel.findOne({ _id: issueRequirementDetail.ReleaseID });
        }
        
        issueDetail.User = issueUserDetail;
        issueDetail.Module = issueModuleDetail;
        issueDetail.Release = issueReleaseDetail;

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            Issues: issuesWithUser.slice(skip, skip + limit),
            Modules: allModules,
            UserAssigns: userAssigns,
            UserCreates: userCreates,
            Releases: releases,
            Categories: ['Bug', 'Task', 'Subtask'],
            Status: ['Assigned', 'Closed', 'Deferred', 'Duplicate', 'Fixed', 'Invalid', 'New', 'Open', 'Reopen', 'Retest', 'Verified'],
            Priorities: ['Show stopper', 'High', 'Medium', 'Low'],
            BugTypes: ['Not Applicable', 'UI/Design', 'Performance', 'Validations', 'Functionality', 'SEO', 'Console Error', 'Server Error', 'Tracking'],
            Environments: ['QA', 'Staging', 'Development', 'Production', 'UAT'],
            IssueDetail: issueDetail,
            sortField,
            sortOrder

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
