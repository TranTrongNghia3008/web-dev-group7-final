'use strict';

const controller = {};
const projectModel = require('../models/projectModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const participationModel = require('../models/participationModel'); 
const userModel = require('../models/userModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Lấy RequirementTypes từ query params và tách thành danh sách
        const requirementTypesQuery = req.query.RequirementTypes;
        const selectedRequirementTypes = requirementTypesQuery ? requirementTypesQuery.split(',') : [];
        let requirementKeyword = req.query.requirementKeyword || '';
        let requirementTypeKeyword = req.query.requirementTypeKeyword || '';
        let assignToKeyword = req.query.assignedTo || '';

         // Lấy các tham số sắp xếp từ query params
         const sortField = req.query.sortField || 'created-date';
         const sortOrder = req.query.sortOrder || 'desc';
         const sortCriteria = {};
         if (sortField === 'created-date') {
             sortCriteria.CreatedAt = sortOrder === 'desc' ? -1 : 1;
         } else if (sortField === 'title') {
             sortCriteria.Description = sortOrder === 'desc' ? -1 : 1;
         } else if (sortField === 'case-code') {
             sortCriteria._id = sortOrder === 'desc' ? -1 : 1;
         }


        // Fetch the project details
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).render('error', { message: 'Project not found' });
        }

        // Lấy tất cả các bản ghi từ bảng Participation có ProjectID tương ứng
        const participations = await participationModel.find({ ProjectID: projectId });

        // Lấy danh sách các UserID từ participations
        const userIds = participations.map(participation => participation.UserID);

        // Lấy thông tin chi tiết của các User thông qua UserID
        const users = await userModel.find({ _id: { $in: userIds } });

        // Lọc danh sách Users theo assignToKeyword
        const filteredUsers = users.filter(user => user.Name.toLowerCase().includes(assignToKeyword.toLowerCase()));

        // Lấy ra các _id của Users thỏa mãn điều kiện
        const filteredUserIds = filteredUsers.map(user => user._id);

        const releases = await releaseModel.find({ ProjectID: project._id });
        const releaseIds = releases.map(release => release._id);

        const allRequirements = await requirementModel.find({ ReleaseID: { $in: releaseIds }, AssignTo: { $in: userIds }, });


        let requirements;
        if (selectedRequirementTypes.length > 0) {
            // Lọc các requirements theo RequirementTypes được chọn
            requirements = await requirementModel.find({ 
                ReleaseID: { $in: releaseIds },
                Type: { $in: selectedRequirementTypes },
                Description: { $regex: requirementKeyword, $options: 'i' },
                AssignTo: { $in: filteredUserIds },
            }).sort(sortCriteria);
        } else {
            // Nếu không có RequirementTypes được chọn, lấy tất cả các requirements
            requirements = await requirementModel.find({ 
                ReleaseID: { $in: releaseIds }, 
                Description: { $regex: requirementKeyword, $options: 'i' },
                AssignTo: { $in: filteredUserIds },
            }).sort(sortCriteria);
        }
        let requirementTypes = [...new Set(allRequirements.map(requirement => requirement.Type))];
        if (requirementTypeKeyword) {
            requirementTypes = requirementTypes.filter(type => type.toLowerCase().includes(requirementTypeKeyword.toLowerCase()));
        }

        // Prepare the data to be sent to the view
        const projectData = {
            ProjectID: project._id,
            Users: users,
            requirementCount: allRequirements.length,
            Requirements: requirements,
            RequirementTypes: requirementTypes,
            sortField,
            sortOrder
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