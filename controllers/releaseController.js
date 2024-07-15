'use strict';

const controller = {};
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const testPlanModel = require('../models/testPlanModel');
const testCaseModel = require('../models/testCaseModel');
const testRunModel = require('../models/testRunModel');
const userModel = require('../models/userModel');
const participationModel = require('../models/participationModel'); 

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });
        const participation = await participationModel.findOne({ UserID: user._id, ProjectID: projectId });
        const statusFilter = req.query.statusFilter ? req.query.statusFilter : 'open';

        if ((!user.IsAdmin) && ((!participation) || (participation && participation.Role === 'Developer'))) {
            const projectData = {
                ProjectID: projectId, // Thêm ProjectID
            };
            res.render('not-have-access', { 
                title: "ShareBug - Not Have Access", 
                header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                        <link rel="stylesheet" href="/css/not-have-access.css" />`, 
                d2: "selected-menu-item", 
                n3: "active border-danger",
                user,
                project: projectData,
            });

        }


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
        // Use statusFilter to determine which page to show
        let openReleasesCount = openReleases.length;
        let upcomingReleasesCount = upcomingReleases.length;
        let completedReleasesCount = completedReleases.length;
        let displayedReleases = [];
        let total = 0;
        if (statusFilter === 'open') {
            total = openReleasesCount;
            displayedReleases = openReleases;
        }
        else if (statusFilter === 'upcoming') {
            total = upcomingReleasesCount;
            displayedReleases = upcomingReleases;
        }
        else if (statusFilter === 'completed') {
            total = completedReleasesCount;
            displayedReleases = completedReleases;
        }
        let limit = 6;
        let page = 1;
        // Validate page query 
        let invalidPage = isNaN(req.query.page) 
        || req.query.page < 1 
        || (req.query.page > Math.ceil(total / limit) && total > 0)
        || (req.query.page > 1 && total == 0);
        if (invalidPage) {
            // Change only the page parameter and reload page
            let queryParams = req.query;
            queryParams.page = 1;
            return res.redirect(`/project/${projectId}/release?${new URLSearchParams(queryParams).toString()}`);
        }
        else
        {
            page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        }
        let skip = (page - 1) * limit;
        let showing = Math.min(total, skip + limit);
        res.locals.pagination = {
            page: page,
            limit: limit,
            showing: showing,
            totalRows: total,
            queryParams: req.query
        };
        // end Pagination

        console.log("---");
        console.log(displayedReleases.slice(skip, skip + limit));

        

        // Tạo projectData với thông tin về các loại release và ProjectID
        const projectData = {
            OpenReleasesCount: openReleasesCount,
            UpcomingReleasesCount: upcomingReleasesCount,
            CompletedReleasesCount: completedReleasesCount,
            Releases: displayedReleases.slice(skip, skip + limit),
            ProjectID: projectId
        };


        // Render view release với thông tin các release thuộc project và các loại release
        res.render('release', { 
            title: "ShareBug - Release", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/release.css" />`,
            d2: "selected-menu-item", 
            n3: "active border-danger",
            user,
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
        const pageOpen = Math.min(Math.ceil(openReleases.length / limit), page)
        const pageUpcoming = Math.min(Math.ceil(upcomingReleases.length / limit), page)
        const pageCompleted = Math.min(Math.ceil(completedReleases.length / limit), page)
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
            openReleasesCheck: page > pageOpen,
            pageOpen,
            upcomingReleasesCheck: page > pageUpcoming,
            pageUpcoming,
            completedReleasesCheck: page > pageCompleted,
            pageCompleted,

            ProjectID: projectId
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });


        // Render view release với thông tin các release thuộc project và các loại release
        res.render('release', { 
            title: "ShareBug - Release", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/release.css" />`,
            d2: "selected-menu-item", 
            n3: "active border-danger",
            user,
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

controller.addRelease = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { name: nameBody, startDate, endDate, description: descriptionBody } = req.body;

        // Sanitize input
        const name = sanitizeInput(nameBody);
        const description = sanitizeInput(descriptionBody);

        const startDay = startDate ? new Date(startDate) : null;
        const endDay = endDate ? new Date(endDate) : null;
        const formattedStartDate = startDay ? startDay.toISOString() : null;
        const formattedEndDate = endDay ? endDay.toISOString() : null;

        const newRelease = await releaseModel.create({
            Name: name,
            StartDate: formattedStartDate,
            EndDate: formattedEndDate,
            Description: description || null,
            ProjectID: projectId,
        });

        if (!newRelease) {
            return res.status(404).json({ message: 'Release not found' });
        }
        else
            res.status(200).json({ message: 'Release Added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Release', error });
    }
};

controller.editRelease = async (req, res) => {
    try {
        const {
            nameEdit: nameEditBody,
            startDateEdit: startDateEditBody,
            endDateEdit: endDateEditBody,
            descriptionEdit: descriptionEditBody,
            idEdit
        } = req.body;

        // Sanitize inputs
        const nameEdit = sanitizeInput(nameEditBody);
        const startDateEdit = startDateEditBody;
        const endDateEdit = endDateEditBody;
        const descriptionEdit = sanitizeInput(descriptionEditBody);

        const startDay = startDateEdit ? new Date(startDateEdit) : null;
        const endDay = endDateEdit ? new Date(endDateEdit) : null;
        const formattedStartDate = startDay ? startDay.toISOString() : null;
        const formattedEndDate = endDay ? endDay.toISOString() : null;

        const updatedRelease = await releaseModel.findByIdAndUpdate(
            idEdit,
            {
                Name: nameEdit,
                StartDate: formattedStartDate,
                EndDate: formattedEndDate,
                Description: descriptionEdit || null,
                UpdatedAt: Date.now()
                // RequirementID: if it is to be updated, include here
            },
        );

        if (!updatedRelease) {
            return res.status(404).json({ message: 'Release not found' });
        }
        else
            res.status(200).json({ message: 'Release Updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Release', error });
    }
};

controller.deleteRelease = async (req, res) => {
    try {
        const releaseId = req.params.releaseId;
        const deletedRelease = await releaseModel.findByIdAndDelete(releaseId);

        if (!deletedRelease) {
            return res.status(404).json({ message: "Release not found" });
        }

        res.json({ message: "Release deleted successfully", deletedRelease });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete Release", error });
    }
};

module.exports = controller;
