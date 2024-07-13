'use strict';

const controller = {};
const moduleModel = require('../models/moduleModel');
const userModel = require('../models/userModel');


controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // console.log(projectId);



        // // Tạo projectData chỉ với thông tin về modules và ProjectID
        const projectData = {
            ProjectID: projectId, // Thêm ProjectID
        };

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });
    

        // Render view module với thông tin các module thuộc project
        res.render('not-have-access', { 
            title: "ShareBug - Not Have Access", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/not-have-access.css" />`, 
            d2: "selected-menu-item", 
            n4: "active border-danger",
            user,
            project: projectData,
        });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = controller;