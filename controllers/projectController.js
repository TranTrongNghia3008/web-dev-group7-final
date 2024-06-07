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

controller.showList = async (req, res) => {
    try {
        // Lấy danh sách các project từ cơ sở dữ liệu
        const projects = await projectModel.find({});

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

        // Render view project-list với dữ liệu các project
        res.render('project-list', { 
            title: "ShareBug - Project list", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/project-list.css" />`, 
            d2: "selected-menu-item",
            projects: projectsWithDetails // Truyền danh sách các project với thông tin chi tiết tới view
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
            activities: activities
        };
        
        // Render the project home view with the project data
        res.render('project-home', { 
            title: "ShareBug - Project home", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/project-home.css" />`, 
            d2: "selected-menu-item", 
            n1: "active border-danger",
            project: projectData,
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = controller;