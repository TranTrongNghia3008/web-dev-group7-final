'use strict';

const controller = {};
const moduleModel = require('../models/moduleModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Tìm tất cả các module thuộc project đó
        const modules = await moduleModel.find({ ProjectID: projectId });

        // Tạo projectData chỉ với thông tin về modules và ProjectID
        const projectData = {
            Modules: modules, // Thêm thông tin về modules
            ProjectID: projectId // Thêm ProjectID
        };

        // Render view module với thông tin các module thuộc project
        res.render('module', { 
            title: "ShareBug - Modules", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/modules-view.css" />`, 
            d2: "selected-menu-item", 
            n4: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;
