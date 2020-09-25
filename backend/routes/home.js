const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Home = require('../models/home');


router.post('', checkAuth, (req, res, next) => {
    const home = new Home(req.body);
    home.save()
        .then(home => {
            res.status(200)
                .json({
                    message: 'Home Added Successfully',
                    result: home
                });
        });
});

router.get('', checkAuth, (req, res, next) => {

    Home.find()
        .populate('project')
        .then(projects => {
            res.status(200)
                .json({
                    message: 'Home Fetched Successfully',
                    result: projects
                });
        });
});

module.exports = router;
