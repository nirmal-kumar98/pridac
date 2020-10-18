const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Activity = require('../models/activity');

router.get('', checkAuth, (req, res, next) => {

    Activity.find({
        user: req.userData.userId  
    })
    .then(activity => {
        res.status(200)
            .json({
                message: 'Activity Fetched Successfully',
                result: activity
            });
    });

});

module.exports = router;