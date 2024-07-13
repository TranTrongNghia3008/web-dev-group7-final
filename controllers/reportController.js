'use strict';

const controller = {};
const reportModel = require('../models/reportModel');
const userModel = require('../models/userModel');

const { sanitizeInput } = require('./shared');

controller.show = async (req, res) => {
    try {
        let options = {};
        
        const projectId = req.params.projectId;
        let reportKeyword = sanitizeInput(req.query.reportKeyword) || '';
        
        // Tìm tất cả các báo cáo thuộc project đó
        // const reports = await reportModel.find({ ProjectID: projectId }, null, options);
        const reportsCount = await reportModel.countDocuments({ ProjectID: projectId,  Title: { $regex: reportKeyword, $options: 'i' }});

        //pagination
        let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
        let limit = 5;
        const pageMax = Math.ceil(reportsCount / limit);
        let skip = (page - 1) * limit;

        if (page > pageMax && pageMax > 0) {
            // Thêm thông báo rằng số trang không tồn tại
            req.flash('error', 'Số trang không tồn tại, đã chuyển về trang hợp lệ.');
            
            const newQuery = {...req.query, page: pageMax};
            const newQueryString = Object.keys(newQuery).map(key => `${key}=${newQuery[key]}`).join('&');
            return res.redirect(`?${newQueryString}`);
        }
        options.limit = limit;
        options.skip = skip;  

        // Tìm tất cả các báo cáo thuộc project đó
        const reports = await reportModel.find({ ProjectID: projectId,  Title: { $regex: reportKeyword, $options: 'i' }}, null, options);
    
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

        const account = req.user;
        const user = await userModel.findOne({ AccountEmail: account.Email });


        // Gọi view và truyền dữ liệu vào
        res.render('report', { 
            title: "ShareBug - Reports", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/reports-view.css" />`,
            d2: "selected-menu-item", 
            n9: "active border-danger",
            user,
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

        const isScheduled = req.body.isScheduled == 'on' ? true : false;

        const type = (reportType ? reportType : '');

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

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

controller.editReport = async (req, res) => {
    try{
        console.log("Data");
        console.log(req.body);
        const projectIdEdit = req.body.projectIdEdit;
        const reportIdEdit = req.body.reportIdEdit;

        const reportTypeEdit = req.body.reportTypeEdit;
        const resourceTypeEdit = req.body.resourceTypeEdit;
        const titleEdit = req.body.titleEdit;
        const startDateEdit = req.body.startDateEdit ? req.body.startDateEdit : null;
        const endDateEdit = req.body.endDateEdit ? req.body.endDateEdit : null;
        const isScheduledEdit = req.body.isScheduledEdit == 'on' ? true : false;

        const currentReport = await reportModel.findById(reportIdEdit);

        // Validate dstartDateEdit < endDateEdit if both are not null
        start = startDateEdit ? new Date(startDateEdit) : null;
        end = endDateEdit ? new Date(endDateEdit) : null;
        

        const updatedReport = await reportModel.findByIdAndUpdate(reportIdEdit, {
            Type: reportTypeEdit,
            Title: titleEdit,
            StartDate: start,
            EndDate: end,
            IsScheduled: isScheduledEdit,
            ProjectID: projectIdEdit,
        });

        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        else
            console.log(updatedReport);
            res.status(200).json({ message: 'Report Updated successfully!' });
    } catch (error){
        res.status(500).json({ message: 'Error updating Report', error });
    }
};

controller.deleteReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const deletedReport = await reportModel.findByIdAndDelete(reportId);

        if (!deletedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json({ message: "Report deleted successfully", deletedReport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete report", error });
    }
};



module.exports = controller;
