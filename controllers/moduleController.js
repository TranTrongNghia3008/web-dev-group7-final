'use strict';

const controller = {};
const moduleModel = require('../models/moduleModel');

controller.show = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // console.log(projectId);

        // Tìm tất cả các module thuộc project đó
        const allModules = await moduleModel.find({ ProjectID: projectId });

        const modules = await moduleModel.find({ ProjectID: projectId, ParentID: null }).sort({ Order: 1 });
        const modulesData = JSON.stringify(modules);
        const numModules = modules.length;

        // // Tạo projectData chỉ với thông tin về modules và ProjectID
        const projectData = {
            Modules: modules, // Thêm thông tin về modules
            ProjectID: projectId, // Thêm ProjectID
            AllModules: allModules
        };

        
    

        // Render view module với thông tin các module thuộc project
        res.render('module', { 
            title: "ShareBug - Modules", 
            header: `<link rel="stylesheet" href="/css/shared-styles.css" />
                    <link rel="stylesheet" href="/css/modules-view.css" />`, 
            d2: "selected-menu-item", 
            n4: "active border-danger",
            project: projectData,
            // modules: modules,
            modulesData: modulesData,
            numModules: numModules,
        });
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).send('Internal Server Error');
    }
}

controller.updateOrder = async (req, res) => {
    try {
        const { order } = req.body;

        // Lặp qua danh sách order và cập nhật thứ tự cho từng module
        for (let i = 0; i < order.length; i++) {
            await moduleModel.findByIdAndUpdate(order[i].id, { Order: order[i].order, UpdatedAt: Date.now() });
        }

        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating module order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.getChildModules = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const projectId = req.params.projectId;
        const childModules = await moduleModel.find({ ProjectID: projectId, ParentID: moduleId }).sort({ Order: 1 });
        res.json(childModules);
    } catch (error) {
        console.error('Error fetching child modules:', error);
        res.status(500).send('Internal Server Error');
    }
};

controller.updateOrderChildModules = async (req, res) => {
    try {
        const { projectId, moduleId } = req.params;
        const { order } = req.body;

        // Lặp qua danh sách order và cập nhật thứ tự cho từng module con của moduleId
        for (let i = 0; i < order.length; i++) {
            await moduleModel.findByIdAndUpdate(order[i].id, { Order: order[i].order, UpdatedAt: Date.now() });
        }

        res.status(200).json({ message: 'Child module order updated successfully' });
    } catch (error) {
        console.error('Error updating child module order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


controller.addModule = async (req, res) => {
    try {
        const { moduleName, parentModule } = req.body;
        const projectId = req.params.projectId;

        // Tìm module con có giá trị Order lớn nhất của parent
        const maxOrderModule = await moduleModel.findOne({ ProjectID: projectId, ParentID: parentModule ? parentModule : null })
            .sort({ Order: -1 }) // Sắp xếp theo Order giảm dần để lấy giá trị lớn nhất
            .limit(1);

        let maxOrder = 0;
        if (maxOrderModule) {
            maxOrder = maxOrderModule.Order; // Lấy giá trị Order lớn nhất
        }

        console.log(moduleName)

        // Tạo module mới với Order là maxOrder + 1
        const newModule = new moduleModel({
            Name: moduleName,
            Order: maxOrder + 1,
            ParentID: parentModule || null,
            ProjectID: projectId // Lấy projectId từ session hoặc request, tùy vào cách bạn quản lý
        });

        // Lưu module vào cơ sở dữ liệu
        await newModule.save();

        res.redirect(`/project/${projectId}/module`); // Chuyển hướng về trang danh sách module
    } catch (error) {
        console.error('Error adding module:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

controller.deleteModule = async (req, res) => {
    try {
        const { projectId, moduleId } = req.params;
        console.log(moduleId);

        // Kiểm tra xem module có phải là parent của các module khác không
        const childModules = await moduleModel.find({ ParentID: moduleId });
        if (childModules.length > 0) {
            // Nếu có module con, có thể chọn cách xóa cả module con hoặc chỉ báo lỗi
            return res.status(400).json({ message: 'Cannot delete module with child modules' });
        }

        // Xóa module
        await moduleModel.findByIdAndDelete(moduleId);


        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = controller;
