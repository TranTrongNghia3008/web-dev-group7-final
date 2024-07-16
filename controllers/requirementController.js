'use strict';

const controller = {};
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const detect = require('detect-csv');
const projectModel = require('../models/projectModel');
const releaseModel = require('../models/releaseModel');
const requirementModel = require('../models/requirementModel');
const participationModel = require('../models/participationModel'); 
const userModel = require('../models/userModel');

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });
        const participation = await participationModel.findOne({ UserID: user._id, ProjectID: projectId });

        if ((!user.IsAdmin) && ((!participation) || (participation && participation.Role === 'Developer'))) {
            const projectData = {
                ProjectID: projectId, // Thêm ProjectID
            };
            return res.render('not-have-access', { 
                title: "ShareBug - Not Have Access", 
                header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                        <link rel="stylesheet" href="/css/not-have-access.css" />`, 
                d2: "selected-menu-item", 
                n2: "active border-danger",
                user,
                project: projectData,
                messages: req.flash()
            });

        }

        // Lấy RequirementTypes từ query params và tách thành danh sách
        const requirementTypesQuery = req.query.RequirementTypes;
        const selectedRequirementTypes = requirementTypesQuery ? requirementTypesQuery.split(',') : [];
        let requirementKeyword = sanitizeInput(req.query.requirementKeyword) || '';
        let requirementTypeKeyword = sanitizeInput(req.query.requirementTypeKeyword) || '';
        let assignToKeyword = sanitizeInput(req.query.assignedTo) || '';

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
        let filteredUserIds = filteredUsers.map(user => user._id);
        if (assignToKeyword.toLowerCase() == "") {
            filteredUserIds = userIds
        }

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
        // Join requirement with users
        requirements = requirements.map(requirement => {
            const user = users.find(user => user._id.equals(requirement.AssignTo));
            return {
                ...requirement.toObject(),
                AssigneeName: user ? user.Name : 'Unknown User',
                AssigneeEmail: user ? user.AccountEmail : 'Unknown Email'
            };
        }
        );





        // Pagination
        let total = requirements.length;
        let limit = 5;
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
            return res.redirect(`/project/${projectId}/requirement?${new URLSearchParams(queryParams).toString()}`);
        }
        else
        {
            page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        }
        let skip = (page - 1) * limit;
        let showing = Math.min(total, skip + limit);
        res.locals.pagination = 
        {
            page: page,
            limit: limit,
            showing: showing,
            totalRows: total,
            queryParams: req.query
        };
        // end Pagination

        // Prepare the data to be sent to the view
        const projectData = {
            ProjectID: project._id,
            Users: users,
            requirementCount: requirements.length,
            requirementTotal: allRequirements.length,
            // requirementCount: requirements.length,
            Requirements: requirements.slice(skip, skip + limit),
            RequirementTypes: requirementTypes,
            Releases: releases,
            sortField,
            sortOrder
        };


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
            user,
            project: projectData,

            messages: req.flash()
        });
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).send('Internal Server Error');
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

    res.render('requirement-import', { 
        title: "ShareBug - Requirement Import", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/dashboard-styles.css" />
                <link rel="stylesheet" href="/css/requirement-styles.css" />`,
        d2: "selected-menu-item", 
        n2: "active border-danger",
        project: projectData,
        user
    });
}

controller.addRequirement = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { releaseName: releaseNameBody, type: typeBody, description: descriptionBody } = req.body;

        // Sanitize each input
        const releaseName = sanitizeInput(releaseNameBody);
        const type = sanitizeInput(typeBody);
        const description = sanitizeInput(descriptionBody);

        const release = await releaseModel.findOne({ Name: releaseName });

        const newRequirement = await requirementModel.create({
            Type: type,
            Description: description || null,
            ReleaseID: release._id || "66601b671ef4a55f282208d3",
            AssignTo: "666011d01cc6e634de0ff70e",
        });


        res.redirect(`/project/${projectId}/requirement`);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Requirement', error });
    }
};

controller.editRequirement = async (req, res) => {
    try {
        const { releaseNameEdit: releaseNameEditBody, typeEdit: typeEditBody, descriptionEdit: descriptionEditBody, idEdit } = req.body;

        // Sanitize each input
        const releaseNameEdit = sanitizeInput(releaseNameEditBody);
        const typeEdit = sanitizeInput(typeEditBody);
        const descriptionEdit = sanitizeInput(descriptionEditBody);

        const release = await releaseModel.findOne({ Name: releaseNameEdit });

        const currentRequirement = await requirementModel.findById(idEdit);
        const typeChanged = currentRequirement.Type !== typeEdit;

        const updatedRequirement = await requirementModel.findByIdAndUpdate(
            idEdit,
            {
                Type: typeEdit,
                Description: descriptionEdit || null,
                ReleaseID: release._id || "66601b671ef4a55f282208d3",
                UpdatedAt: Date.now()
                // AssignTo: if it is to be updated, include here
            },
        );

        if (!updatedRequirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        else
            res.status(200).json({ message: 'Requirement Updated successfully!', typeChanged: typeChanged });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Requirement', error });
    }
};

controller.deleteRequirement = async (req, res) => {
    try {
        const requirementId = req.params.requirementId;
        const deletedRequirement = await requirementModel.findByIdAndDelete(requirementId);

        if (!deletedRequirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        res.json({ message: "Requirement deleted successfully", deletedRequirement });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete requirement", error });
    }
};

controller.importRequirement = async (req, res) => {
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

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const delimiter = detect(fileContent).delimiter;

        // Đọc dữ liệu từ file CSV
        let requirements = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter }))
            .on('data', (row) => {
                // Tạo đối tượng Requirement từ dữ liệu trong file CSV
                const newRequirement = new requirementModel({
                    Type: row.Type,
                    Description: row.Description,
                    ReleaseID: row.ReleaseID, // Giả sử ReleaseID là một ObjectId hợp lệ
                    AssignTo: row.AssignTo // Giả sử đang có thông tin user từ req.user
                });
                requirements.push(newRequirement);
            })
            .on('end', async () => {
                // Lưu các đối tượng Requirement vào MongoDB
                try {
                    const createdRequirements = await requirementModel.insertMany(requirements);
                    res.redirect(`/project/${projectId}/requirement`);
                } catch (error) {
                    console.error('Error importing requirements:', error);
                    res.status(500).send('Internal server error');
                }
            });

    } catch (error) {
        console.error('Error in importRequirement:', error);
        res.status(500).send('Internal server error');
    }
};

controller.exportRequirement = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Fetch the project details
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).render('error', { message: 'Project not found' });
        }

        // Lấy tất cả các bản ghi từ bảng Participation có ProjectID tương ứng
        const participations = await participationModel.find({ ProjectID: projectId });

        // Lấy danh sách các UserID từ participations
        const userIds = participations.map(participation => participation.UserID);

        const releases = await releaseModel.find({ ProjectID: project._id });
        const releaseIds = releases.map(release => release._id);

        const requirements = await requirementModel.find({ ReleaseID: { $in: releaseIds }, AssignTo: { $in: userIds }, });

        // Chuyển đổi dữ liệu thành mảng các đối tượng chỉ chứa các thuộc tính cần xuất
        const csvData = requirements.map(req => ({
            Type: req.Type,
            Description: req.Description,
            ReleaseID: req.ReleaseID.toString(), // Chuyển ObjectId sang chuỗi
            AssignTo: req.AssignTo.toString() // Chuyển ObjectId sang chuỗi
        }));

        // Tạo đối tượng ObjectsToCsv với mảng dữ liệu đã được chuyển đổi
        const csv = new ObjectsToCsv(csvData);

        // Đường dẫn và tên file CSV để lưu trữ
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `requirementFileExport-${uniqueSuffix}`;
        const filePath = path.join(__dirname, `../public/files/${fileName}.csv`);

        // Ghi dữ liệu xuống file CSV
        await csv.toDisk(filePath);

        // Chuẩn bị phản hồi để tải xuống file CSV
        res.download(filePath, 'requirements_export.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            } else {
                // Xóa file sau khi tải xuống thành công (tùy chọn)
                fs.unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error('Error exporting requirements:', error);
        res.status(500).send('Internal server error');
    }
};

controller.downloadSampleRequirement = async (req, res) => {
    try {
        // Đường dẫn và tên file CSV để lưu trữ
        const filePath = path.join(__dirname, '../public/files/testImportRequirement.csv');

        // Chuẩn bị phản hồi để tải xuống file CSV
        res.download(filePath, 'sample_requirements.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal server error');
            }
        });
    } catch (error) {
        console.error('Error exporting requirements:', error);
        res.status(500).send('Internal server error');
    }
};


module.exports = controller;