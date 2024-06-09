'use strict';

const controller = {};
const projectModel = require('../models/projectModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');

controller.show = async (req, res) => {
    try {
        //pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;


        const projectId = req.params.projectId;

        // Fetch the project details
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).render('error', { message: 'Project not found' });
        }

        const releases = await releaseModel.find({ ProjectID: project._id });
        const releaseIds = releases.map(release => release._id);

        const requirements = await requirementModel.find({ ReleaseID: { $in: releaseIds } });
        const requirementTypes = [...new Set(requirements.map(requirement => requirement.Type))];

        // Prepare the data to be sent to the view
        const projectData = {
            ProjectID: project._id,
            requirementCount: requirements.length,
            Requirements: requirements.slice(skip, skip + limit),
            RequirementTypes: requirementTypes,
        };
        //console.log(page, " ", skip, " ", skip + limit);

        // Only get the requirements for the current page


        res.locals.pagination =
        {
            page: page,
            limit: limit,
            showing: projectData.Requirements.length,
            totalRows: requirements.length,
            queryParams: req.query
        };

        res.render('requirement', { 
            title: "ShareBug - Requirement",
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/dashboard-styles.css" />
                    <link rel="stylesheet" href="/css/requirement-styles.css" />`,
            d2: "selected-menu-item",
            n2: "active border-danger",
            project: projectData,
        });
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).send('Internal Server Error');
    }
};

controller.showImport = (req, res) => {
    const projectId = req.params.projectId;

    if (!projectId) {
        return res.status(404).render('error', { message: 'Project not found' });
    }

    const projectData = {
        ProjectID: projectId,
    };

    res.render('requirement-import', { 
        title: "ShareBug - Requirement Import", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`,
        d2: "selected-menu-item", 
        n2: "active border-danger",
        project: projectData,
    });
}




module.exports = controller;