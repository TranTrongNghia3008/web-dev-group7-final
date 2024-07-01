'use strict';

const controller = {};
const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');
const moduleModel = require('../models/moduleModel');
const testCaseModel = require('../models/testCaseModel');
const testRunModel = require('../models/testRunModel');
const issueModel = require('../models/issueModel');
const releaseModel = require('../models/releaseModel');
const activityModel = require('../models/activityModel'); 
const participationModel = require('../models/participationModel'); 

const { sanitizeInput } = require('./shared');

controller.showList = async (req, res) => {
    try {

        let projectKeyword = sanitizeInput(req.query.projectKeyword) || '';

        // Lấy các tham số sắp xếp từ query params
        const sortField = req.query.sortField || 'created-date';
        const sortOrder = req.query.sortOrder || 'desc';
        const sortCriteria = {};
        if (sortField === 'created-date') {
            sortCriteria.CreatedAt = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'title') {
            sortCriteria.Name = sortOrder === 'desc' ? -1 : 1;
        } else if (sortField === 'case-code') {
            sortCriteria._id = sortOrder === 'desc' ? -1 : 1;
        }

        // Lấy danh sách các project từ cơ sở dữ liệu
        const projects = await projectModel.find({Name: { $regex: projectKeyword, $options: 'i' }}).sort(sortCriteria);

        // Lấy thông tin chi tiết cho từng project
        const projectPromises = projects.map(async (project) => {
            const creator = await userModel.findById(project.Creater);
            const modules = await moduleModel.find({ ProjectID: project._id });
            const moduleIds = modules.map(module => module._id);

            const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
            const testCaseIds = testCases.map(testCase => testCase._id);

            const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
            const testRunIds = testRuns.map(testRun => testRun._id);

            const issues = await issueModel.find({ TestRunID: { $in: testRunIds } });

            return {
                ProjectID: project._id,
                Name: project.Name,
                ProjectImage: project.ProjectImage,
                CreatedAt: project.CreatedAt,
                Creater: creator ? creator.Name : 'Unknown',
                testCaseCount: testCases.length,
                testRunCount: testRuns.length,
                issueCount: issues.length
            };
        });

        const projectsWithDetails = await Promise.all(projectPromises);

        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let total = projectsWithDetails.length;
        let limit = 5;
        const pageMax = Math.ceil(total / limit)
        let skip = (page - 1) * limit;

        if (page > pageMax) {
            // Thêm thông báo rằng số trang không tồn tại
            req.flash('error', 'Số trang không tồn tại, đã chuyển về trang hợp lệ.');
            
            const newQuery = {...req.query, page: pageMax};
            const newQueryString = Object.keys(newQuery).map(key => `${key}=${newQuery[key]}`).join('&');
            return res.redirect(`?${newQueryString}`);
        }
        
        let showing = Math.min(limit, total - skip);
        res.locals.pagination =
        {
            page: page,
            limit: limit,
            showing: showing,
            totalRows: total,
            queryParams: req.query
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });
        const users = await userModel.find();

        // Render view project-list với dữ liệu các project
        res.render('project-list', { 
            title: "ShareBug - Project list", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/project-list.css" />`, 
            d2: "selected-menu-item",
            user,
            users,
            projects: projectsWithDetails.slice(skip, skip + limit), // Truyền danh sách các project với thông tin chi tiết tới view
            sortField,
            sortOrder,

            messages: req.flash()
        });
    } catch (error) {
        console.error('Error fetching project list:', error);
        res.status(500).send('Internal Server Error');
    }
};

controller.showHome = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Fetch the project details
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).render('error', { message: 'Project not found' });
        }

        // Fetch the associated details
        const creator = await userModel.findById(project.Creater);
        const modules = await moduleModel.find({ ProjectID: project._id });
        const moduleIds = modules.map(module => module._id);

        const testCases = await testCaseModel.find({ ModuleID: { $in: moduleIds } });
        const testCaseIds = testCases.map(testCase => testCase._id);

        const testRuns = await testRunModel.find({ TestCaseID: { $in: testCaseIds } });
        const testRunIds = testRuns.map(testRun => testRun._id);

        const issues = await issueModel.find({ TestRunID: { $in: testRunIds } });

        const releases = await releaseModel.find({ ProjectID: project._id });

        const activities = await activityModel.find({ ModuleID: { $in: moduleIds } });
        // Đếm số lượng test run theo status
        const openReleaseStatus = ['Passed', 'Untested', 'Blocked', 'Retest', 'Failed', 'Not Applicable', 'In Progress', 'Hold'];
        const numOpenReleaseStatus= openReleaseStatus.map(status => {
            return testRuns.filter(testRun => testRun.Status === status).length;
        });

        const participations = await participationModel.find({ ProjectID: projectId });
        const assigneesIds = participations.map(participation => participation.UserID);
        const userAssigns = await userModel.find({ _id: { $in: assigneesIds } });
        const userAssignMap = userAssigns.reduce((map, userAssign) => {
            map[userAssign._id] = userAssign;
            return map;
        }, {});

        const participationsWithUserName = participations.map(participation => {
            return {
                ...participation._doc, // spread the document properties
                Name: userAssignMap[participation.UserID] ? userAssignMap[participation.UserID].Name : 'Unknown', // Assuming 'name' is the field in userAssign model
            };
        })


        // Prepare the data to be sent to the view
        const projectData = {
            ProjectID: project._id,
            Name: project.Name,
            ProjectImage: project.ProjectImage,
            CreatedAt: project.CreatedAt,
            Creater: creator ? creator.Name : 'Unknown',
            testCaseCount: testCases.length,
            testRunCount: testRuns.length,
            issueCount: issues.length,
            releaseCount: releases.length,
            testCases: testCases.map(testCase => testCase._id),
            testRuns: testRuns.map(testRun => testRun._id),
            issues: issues.map(issue => issue._id),
            releases: releases.map(release => release._id),
            activities: activities,
            numOpenReleaseStatus: numOpenReleaseStatus,
            Participations: participationsWithUserName
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });
        
        // Render the project home view with the project data
        res.render('project-home', { 
            title: "ShareBug - Project home", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/project-home.css" />`, 
            d2: "selected-menu-item", 
            n1: "active border-danger",
            user,
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};


controller.assignUser = async (req, res) => {
    const { role, assignUser, projectId } = req.body;
    console.log( role, assignUser, projectId)
  
    try {
      // Tạo mới participation
      const participation = new participationModel({
        Role: role,
        UserID: assignUser,
        ProjectID: projectId,
      });
  
      // Lưu vào database
      await participation.save();
  
      res.status(200).json({ success: true, message: 'User assigned successfully.' });
    } catch (error) {
      console.error('Error assigning user:', error);
      res.status(500).json({ success: false, message: 'Failed to assign user.' });
    }
  };
  

  controller.removeAssignUser = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await participationModel.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Assign User removed successfully.' });
        } else {
            res.status(404).json({ message: 'Assign User not found.' });
        }
    } catch (error) {
        console.error('Error deleting test run:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = controller;