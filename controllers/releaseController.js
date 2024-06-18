'use strict';

const controller = {};
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const testCaseModel = require('../models/testCaseModel');
const testRunModel = require('../models/testRunModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const currentDate = new Date();

        // Tìm tất cả các release thuộc project đó
        // Vì lý do này mà xử lý pagination khó
        const releases = await releaseModel.find({ ProjectID: projectId });

        // Tạo các mảng để lưu các release theo loại
        const openReleases = [];
        const upcomingReleases = [];
        const completedReleases = [];

        // Lặp qua từng release và xác định loại của nó
        releases.forEach(release => {
            // Convert các ngày trong release sang dạng Date object
            const startDate = new Date(release.StartDate);
            const endDate = new Date(release.EndDate);

            // Kiểm tra loại của release
            if (currentDate >= startDate && currentDate <= endDate) {
                openReleases.push(release);
            } else if (currentDate < startDate) {
                upcomingReleases.push(release);
            } else {
                completedReleases.push(release);
            }
        });


        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 2;
        let skip = (page - 1) * limit;
        res.locals.pagination = {
            openReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, openReleases.length - skip),
                totalRows: openReleases.length,
                queryParams: req.query
            },
            upcomingReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, upcomingReleases.length - skip),
                totalRows: upcomingReleases.length,
                queryParams: req.query
            },
            completedReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, completedReleases.length - skip),
                totalRows: completedReleases.length,
                queryParams: req.query
            }
        };

        // Tạo projectData với thông tin về các loại release và ProjectID
        const projectData = {
            OpenReleases: openReleases.slice(skip, skip + limit),
            OpenReleasesCount: openReleases.length,
            UpcomingReleases: upcomingReleases.slice(skip, skip + limit),
            UpcomingReleasesCount: upcomingReleases.length,
            CompletedReleases: completedReleases.slice(skip, skip + limit),
            CompletedReleasesCount: completedReleases.length,
            ProjectID: projectId
        };

        // Render view release với thông tin các release thuộc project và các loại release
        res.render('release', { 
            title: "ShareBug - Release", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/release.css" />`,
            d2: "selected-menu-item", 
            n3: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching releases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showDetail = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const currentDate = new Date();

        // Tìm tất cả các release thuộc project đó
        // Vì lý do này mà xử lý pagination khó
        const releases = await releaseModel.find({ ProjectID: projectId });

        // Tạo các mảng để lưu các release theo loại
        const openReleases = [];
        const upcomingReleases = [];
        const completedReleases = [];

        // Lặp qua từng release và xác định loại của nó
        releases.forEach(release => {
            // Convert các ngày trong release sang dạng Date object
            const startDate = new Date(release.StartDate);
            const endDate = new Date(release.EndDate);

            // Kiểm tra loại của release
            if (currentDate >= startDate && currentDate <= endDate) {
                openReleases.push(release);
            } else if (currentDate < startDate) {
                upcomingReleases.push(release);
            } else {
                completedReleases.push(release);
            }
        });


        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 2;
        let skip = (page - 1) * limit;
        res.locals.pagination = {
            openReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, openReleases.length - skip),
                totalRows: openReleases.length,
                queryParams: req.query
            },
            upcomingReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, upcomingReleases.length - skip),
                totalRows: upcomingReleases.length,
                queryParams: req.query
            },
            completedReleases:
            {
                page: page,
                limit: limit,
                showing: Math.min(limit, completedReleases.length - skip),
                totalRows: completedReleases.length,
                queryParams: req.query
            }
        };

        const releaseId = req.params.releaseId;
        const releaseDetail = await releaseModel.findOne({ _id: releaseId });

        const releaseRequirementDetail = await requirementModel.find({ ReleaseID: releaseId });
        const releaseRequirementDetailIds = releaseRequirementDetail.map(requirement => requirement._id);

        const releaseTestPlanDetail = await testPlanModel.find({ RequirementID: { $in: releaseRequirementDetailIds } });
        const releaseTestPlanDetailIds = releaseTestPlanDetail.map(testPlan => testPlan._id);

        const releaseTestCaseDetail = await testCaseModel.find({ TestPlanID: { $in: releaseTestPlanDetailIds } });
        const releaseTestCaseDetailIds = releaseTestCaseDetail.map(testCase => testCase._id);

        const releaseTestRunDetail = await testRunModel.find({ TestCaseID: { $in: releaseTestCaseDetailIds } });

        releaseDetail.TestRuns = releaseTestRunDetail;
        const statusCounts = {
            Passed: 0,
            Failed: 0,
            Untested: 0,
            Other: 0
        };
        
        releaseTestRunDetail.forEach(testRun => {
            switch (testRun.Status) {
                case 'Passed':
                    statusCounts.Passed++;
                    break;
                case 'Failed':
                    statusCounts.Failed++;
                    break;
                case 'Untested':
                    statusCounts.Untested++;
                    break;
                default:
                    statusCounts.Other++;
                    break;
            }
        });
        releaseDetail.StatusCounts = statusCounts;

        // Tạo projectData với thông tin về các loại release và ProjectID
        const projectData = {
            OpenReleases: openReleases.slice(skip, skip + limit),
            OpenReleasesCount: openReleases.length,
            UpcomingReleases: upcomingReleases.slice(skip, skip + limit),
            UpcomingReleasesCount: upcomingReleases.length,
            CompletedReleases: completedReleases.slice(skip, skip + limit),
            CompletedReleasesCount: completedReleases.length,
            ReleaseDetail: releaseDetail,
            ProjectID: projectId
        };

        // Render view release với thông tin các release thuộc project và các loại release
        res.render('release', { 
            title: "ShareBug - Release", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/release.css" />`,
            d2: "selected-menu-item", 
            n3: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching releases:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.getReleaseNameById = async (req, res) => {
    try {
        const releaseId = req.params.releaseId;
        const release = await releaseModel.findById(releaseId);
        if (!release) {
            return res.status(404).json({ message: 'Release not found' });
        }
        res.json({ ReleaseName: release.Name });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching release name', error });
    }
};

module.exports = controller;
