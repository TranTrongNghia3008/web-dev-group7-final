'use strict';

const controller = {};

controller.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
};

module.exports = controller;