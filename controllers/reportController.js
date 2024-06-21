'use strict';

const controller = {};
const reportModel = require('../models/reportModel');

controller.show = async (req, res) => {
    try {
        let options = {};
        // Pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        let skip = (page - 1) * limit;
    
    
        options.limit = limit;
        options.skip = skip;  
        
        
        const projectId = req.params.projectId;
        let reportKeyword = req.query.reportKeyword || '';

        // Tìm tất cả các báo cáo thuộc project đó
        const reports = await reportModel.find({ ProjectID: projectId,  Title: { $regex: reportKeyword, $options: 'i' }}, null, options);
        
        // Tìm tất cả các báo cáo thuộc project đó
        // const reports = await reportModel.find({ ProjectID: projectId }, null, options);
        const reportsCount = await reportModel.countDocuments({ ProjectID: projectId });
        res.locals.pagination =
        {
            page: page,
            limit: limit,
            showing: reports.length,
            totalRows: reportsCount,
            queryParams: req.query
        };


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
};

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
};

controller.addReport = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const reportType = req.body.reportType;
        const resourceType = req.body.resourceType;
        const title = req.body.title;
        const startDate = req.body.startDate ? req.body.startDate : null;
        const endDate = req.body.endDate ? req.body.endDate : null;
        const startTime = req.body.startTime ? req.body.startTime : null;
        const endTime = req.body.endTime ? req.body.endTime : null;

        const isScheduled = req.body.isScheduled == 'on' ? true : false;

        const type = (reportType ? reportType : '') + ': ' + (resourceType ? resourceType : '');
        console.log(startDate);

        const start = startDate ? new Date(startDate + 'T' + (startTime ? startTime : "00:00")) : null;
        const end = endDate ?  new Date(endDate + 'T' + (endTime ? endTime : "00:00")) : null;



        const newReport = await reportModel.create({
            Type: type,
            Title: title,
            StartDate: start,
            EndDate: end,
            IsScheduled: isScheduled,
            ProjectID: projectId
        });

        res.redirect(`/project/${projectId}/report`);

    } catch (error) {
        res.status(500).json({ message: 'Error creating Report', error });
    }
};


module.exports = controller;
