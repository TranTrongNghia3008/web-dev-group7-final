'use strict';

const controller = {};
const releaseModel = require('../models/releaseModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const currentDate = new Date();

        // Tìm tất cả các release thuộc project đó
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

        // Tạo projectData với thông tin về các loại release và ProjectID
        const projectData = {
            OpenReleases: openReleases,
            UpcomingReleases: upcomingReleases,
            CompletedReleases: completedReleases,
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

module.exports = controller;
