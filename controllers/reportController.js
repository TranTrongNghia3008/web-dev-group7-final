'use strict';

const controller = {};
const reportModel = require('../models/reportModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Tìm tất cả các báo cáo thuộc project đó
        const reports = await reportModel.find({ ProjectID: projectId });

        // Gói dữ liệu trong projectData
        const projectData = {
            ProjectID: projectId,
            Reports: reports
        };

        // Gọi view và truyền dữ liệu vào
        res.render('report', { 
            title: "ShareBug - Reports", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/reports-view.css" />`,
            d2: "selected-menu-item", 
            n9: "active border-danger",
            project: projectData
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.showAdd = (req, res) => {
    const projectId = req.params.projectId;

    // Gói dữ liệu trong projectData chỉ có projectID
    const projectData = {
        ProjectID: projectId
    };

    // Gọi view và truyền dữ liệu vào
    res.render('report-add', { 
        title: "ShareBug - Add Report", 
        header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                <link rel="stylesheet" href="/css/reports-add.css" />`,
        d2: "selected-menu-item", 
        n9: "active border-danger",
        project: projectData
    });
}

module.exports = controller;
