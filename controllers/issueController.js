'use strict';

const controller = {};
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const issueModel = require('../models/issueModel');
const testRunModel = require('../models/testRunModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');
const userModel = require('../models/userModel');
const participationModel = require('../models/participationModel'); 

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        let issueTitleKeyword = sanitizeInput(req.query.issueTitleKeyword) || '';
        let issueCodeKeyword = sanitizeInput(req.query.issueCodeKeyword) || '';


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

        const testRunMap = testRuns.reduce((map, testRun) => {
            map[testRun._id] = testRun.Name;
            return map;
        }, {});

        // Kết hợp dữ liệu test run với thông tin người được giao
        const issuesWithUser = issues.map(issue => {
            return {
                ...issue._doc, // spread the document properties
                AssignTo: userAssignMap[issue.AssignedTo] ? userAssignMap[issue.AssignedTo].Name : 'Unknown', // Assuming 'name' is the field in user model
                CreatedBy: userCreatedMap[issue.CreatedBy] ? userCreatedMap[issue.CreatedBy].Name : 'Unknown',
                TestRunName: testRunMap[issue.TestRunID] ? testRunMap[issue.TestRunID] : 'Unknown'
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


        // Lấy tất cả các bản ghi từ bảng Participation có ProjectID tương ứng
        const participations = await participationModel.find({ ProjectID: projectId });

        // Lấy danh sách các UserID từ participations
        const userIds = participations.map(participation => participation.UserID);

        // Lấy thông tin chi tiết của các User thông qua UserID
        const users = await userModel.find({ _id: { $in: userIds } });

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });

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
            Severities: ['Critical', 'Blocker', 'Major', 'Minor', 'Trivial'],
            sortField,
            sortOrder,
            Users: users,
            TestRuns: testRuns

        };

        // Gọi view và truyền dữ liệu vào
        res.render('issue', { 
            title: "ShareBug - Issues", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/issues-view-styles.css" />`,
            d2: "selected-menu-item", 
            n8: "active border-danger",
            user,
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

        let issueTitleKeyword = sanitizeInput(req.query.issueTitleKeyword) || '';
        let issueCodeKeyword = sanitizeInput(req.query.issueCodeKeyword) || '';


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
            Severities: ['Critical', 'Blocker', 'Major', 'Minor', 'Trivial'],
            IssueDetail: issueDetail,
            sortField,
            sortOrder     
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });


        // Gọi view và truyền dữ liệu vào
        res.render('issue', { 
            title: "ShareBug - Issues", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/issues-view-styles.css" />`,
            d2: "selected-menu-item", 
            n8: "active border-danger",
            user,
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.addIssue = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const {
            'issue-title': issueTitle,
            category,
            status,
            priority,
            'start-day': startDay,
            'end-day': endDay,
            'issue-type': issueType,
            severity,
            environment,
            'issue-description': issueDescription,
            'steps-to-reproduce': stepsToReproduce,
            'assigned-to': assignToName,
            'testRun': testrun
        } = req.body;

        // Tìm kiếm thông tin của người được phân công và test run từ cơ sở dữ liệu
        const assignTo = assignToName ? await userModel.findOne({ Name: assignToName }) : null;
        const testRun = testrun ? await testRunModel.findOne({ Name: testrun }) : null;

        // Chuyển đổi startDay và endDay thành đối tượng Date nếu có giá trị
        const startDate = startDay ? new Date(startDay) : null;
        const endDate = endDay ? new Date(endDay) : null;

        const formattedStartDate = startDate ? startDate.toISOString() : null;
        const formattedEndDate = endDate ? endDate.toISOString() : null;
        
        // Tạo đối tượng mới Issue
        const newIssue = new issueModel({
            Title: issueTitle,
            Category: category,
            Status: status,
            Priority: priority,
            StartDate: formattedStartDate,
            EndDate: formattedEndDate,
            IssueType: issueType || null,
            Severity: severity || null,
            Environment: environment || null,
            Description: issueDescription || null, // Gán giá trị null nếu không có dữ liệu
            StepsToReproduce: stepsToReproduce || null, // Gán giá trị null nếu không có dữ liệu
            CreatedBy: "666011d01cc6e634de0ff70b",
            AssignedTo: assignTo ? assignTo._id : null, // Gán giá trị null nếu không tìm thấy người được phân công
            TestRunID: testRun ? testRun._id : null // Gán giá trị null nếu không tìm thấy test run
        });

        // Lưu issue vào cơ sở dữ liệu
        await newIssue.save();
        res.status(201).json({ message: 'Issue added successfully'});

        // res.redirect(`/project/${projectId}/issue`);

    } catch (error) {
        console.error('Error adding issue:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


controller.editIssue = async (req, res) => {
    try {
        const { 'issue-id': id, 'issue-title': title, 'issue-description': description, category, status, priority, 'issue-type': issueType, severity, environment, 'start-day': startDay, 'end-day': endDay, 'assigned-to': assignedToName, 'testRun': testRunName, 'steps-to-reproduce': stepsToReproduce, projectID } = req.body;

        // Tìm kiếm user và test run từ cơ sở dữ liệu (nếu có)
        const assignTo = assignedToName ? await userModel.findOne({ Name: assignedToName }) : null;
        const testRun = testRunName ? await testRunModel.findOne({ Name: testRunName }) : null;

        // Chuyển đổi startDay và endDay thành đối tượng Date nếu có giá trị
        const startDate = startDay ? new Date(startDay) : null;
        const endDate = endDay ? new Date(endDay) : null;
        console.log(assignTo);

        // Tạo đối tượng chứa các trường cập nhật
        const updateFields = {
            Title: title,
            Description: description || null,
            Category: category,
            Status: status,
            Priority: priority,
            IssueType: issueType || null,
            Severity: severity || null,
            Environment: environment || null,
            StartDate: startDate,
            EndDate: endDate,
            AssignedTo: assignTo ? assignTo._id : null,
            TestRunID: testRun ? testRun._id : null,
            StepsToReproduce: stepsToReproduce || null,
            UpdatedAt: Date.now()
        };

        // Xây dựng object để chỉ cập nhật các trường có giá trị (loại bỏ các trường null)
        const filteredUpdateFields = {};
        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] !== null && updateFields[key] !== undefined) {
                filteredUpdateFields[key] = updateFields[key];
            }
        });

        await issueModel.findByIdAndUpdate(id, filteredUpdateFields);
        res.status(200).json({ message: 'Issue updated successfully'});


        // res.redirect(`/project/${projectID}/issue`); // Redirect về trang danh sách issues của dự án
    } catch (error) {
        console.error('Error editing issue:', error);
        res.status(500).send('Internal Server Error');
    }
};


controller.deleteIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const result = await issueModel.findByIdAndDelete(issueId);
        if (result) {
            res.status(200).json({ message: 'Issue deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Issue not found.' });
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.showImport = async (req, res) => {
    const projectId = req.params.projectId;

    if (!projectId) {
        return res.status(404).render('error', { message: 'Project not found' });
    }

    const account = req.user;
    const user = await userModel.findOne({ AccountEmail: account.Email });

    const projectData = {
        ProjectID: projectId,
    };

    res.render('issue-import', { 
        title: "ShareBug - Issue Import", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />,
                <link rel="stylesheet" href="/css/issues-view-styles.css" />,
                <link rel="stylesheet" href="/css/requirement-styles.css" />`,
        d2: "selected-menu-item", 
        n8: "active border-danger",
        project: projectData,
        user
    });
}

controller.importIssue = async (req, res) => {
    const projectId = req.params.projectId;

    try {
        // Kiểm tra xem file đã được tải lên chưa
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        // Kiểm tra xem file có phải là CSV không
        if (req.file.mimetype !== "text/csv") {
            return res.status(400).send('Select CSV files only.');
        }

        // Đường dẫn đến file CSV đã tải lên
        const filePath = req.file.path;

        // Đọc dữ liệu từ file CSV
        let issues = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Chuyển đổi startDay và endDay thành đối tượng Date nếu có giá trị
                const startDate = row.StartDate ? new Date(row.StartDate) : null;
                const endDate = row.EndDate ? new Date(row.EndDate) : null;
                
                const formattedStartDate = startDate ? startDate.toISOString() : null;
                const formattedEndDate = endDate ? endDate.toISOString() : null;

                // Tạo đối tượng Issue từ dữ liệu trong file CSV
                const newIssue = new issueModel({
                    Title: row.Title,
                    Category: row.Category,
                    Status: row.Status,
                    Priority: row.Priority,
                    StartDate: startDate,
                    EndDate: endDate,
                    IssueType: row.IssueType || null,
                    Severity: row.Severity || null,
                    Environment: row.Environment || null,
                    Description: row.Description || null,
                    StepsToReproduce: row.StepsToReproduce || null,
                    CreatedBy: "666011d01cc6e634de0ff70b",
                    AssignedTo: row.AssignedTo || null,
                    TestRunID: row.TestRunID || null
                });
                issues.push(newIssue);
            })
            .on('end', async () => {
                // Lưu các đối tượng Issue vào MongoDB
                try {
                    const createdIssues = await issueModel.insertMany(issues);
                    res.redirect(`/project/${projectId}/issue`);
                } catch (error) {
                    console.error('Error importing issues:', error);
                    res.status(500).send('Internal server error');
                }
            });

    } catch (error) {
        console.error('Error in importIssue:', error);
        res.status(500).send('Internal server error');
    }
};

controller.exportIssue = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Tìm tất cả các module thuộc project đó
        const allModules = await moduleModel.find({ ProjectID: projectId });
        const moduleIds = allModules.map(module => module._id);

        let testCases = await testCaseModel.find({ 
                ModuleID: { $in: moduleIds }, 
            });

        const testCaseIds = testCases.map(testCase => testCase._id);

        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        let query = { 
            TestRunID: { $in: testRunIds },
        };

        const issuesTemp = await issueModel.find(query)
        
        // Tạo một danh sách các userId để tìm kiếm thông tin người được giao
        const assignToIds = issuesTemp.map(issue => issue.AssignedTo);

        const createdByIds = issuesTemp.map(issue => issue.CreatedBy);

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

        const testRunMap = testRuns.reduce((map, testRun) => {
            map[testRun._id] = testRun.Name;
            return map;
        }, {});

        // Kết hợp dữ liệu test run với thông tin người được giao
        const issuesWithUser = issuesTemp.map(issue => {
            return {
                ...issue._doc, // spread the document properties
                AssignTo: userAssignMap[issue.AssignedTo] ? userAssignMap[issue.AssignedTo].Name : 'Unknown', // Assuming 'name' is the field in user model
                CreatedBy: userCreatedMap[issue.CreatedBy] ? userCreatedMap[issue.CreatedBy].Name : 'Unknown',
                TestRunName: testRunMap[issue.TestRunID] ? testRunMap[issue.TestRunID] : 'Unknown'
            };
        });

        // Chuyển đổi dữ liệu thành mảng các đối tượng chỉ chứa các thuộc tính cần xuất
        const csvData = issuesWithUser.map(
            req => ({
            Title: req.Title,
            Category: req.Category,
            Status: req.Status,
            Priority: req.Priority,
            StartDate: req.StartDate.toISOString().split('T')[0],
            EndDate: req.EndDate.toISOString().split('T')[0],
            IssueType: req.IssueType,
            Severity: req.Severity,
            Environment: req.Environment,
            Description: req.Description,
            StepsToReproduce: req.StepsToReproduce,
            CreatedBy: req.CreatedBy,
            AssignTo: req.AssignTo,
            TestRunName: req.TestRunName
        }));

        // Tạo đối tượng ObjectsToCsv với mảng dữ liệu đã được chuyển đổi
        const csv = new ObjectsToCsv(csvData);

        // Đường dẫn và tên file CSV để lưu trữ
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `issueFileExport-${uniqueSuffix}`;
        const filePath = path.join(__dirname, `../public/files/${fileName}.csv`);

        // Ghi dữ liệu xuống file CSV
        await csv.toDisk(filePath);

        // Chuẩn bị phản hồi để tải xuống file CSV
        res.download(filePath, 'issues_export.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            } else {
                // Xóa file sau khi tải xuống thành công (tùy chọn)
                fs.unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error('Error exporting issues:', error);
        res.status(500).send('Internal server error');
    }
};

controller.downloadSampleIssue = async (req, res) => {
    try {
        // Đường dẫn và tên file CSV để lưu trữ
        const filePath = path.join(__dirname, '../public/files/testImportIssue.csv');

        // Chuẩn bị phản hồi để tải xuống file CSV
        res.download(filePath, 'sample_issues.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        console.error('Error exporting issues:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = controller;
