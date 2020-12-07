const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Activity = require('../models/activity');
const Settings = require('../models/settings');

router.post('', checkAuth, (req, res, next) => {

    const settings = new Settings({
        user: req.body.user,
        signup: req.body.signup,
        userCanLogin: req.body.userCanLogin,
        userCanSettings: req.body.userCanSettings,
        forgotPassword: req.body.forgotPassword
    })
    settings.save()
        .then(document => {
            res.status(200)
                .json({
                    message: 'Settings Created',
                    result: document
                })
        })
});


router.get('', (req, res, next) => {

    Settings.find()
        .then((settings) => {
            res.status(200)
                .json({
                    message: 'Settings Fetched Successfully',
                    result: settings[0]
                })
        })
});

router.post('/:id', checkAuth, (req, res, next) => {

    console.log(req.body);
    
    Settings.update({ _id: req.params.id},
        {
            $set: {
                'user': req.body.user,
                'signup': req.body.signup,
                'userCanLogin': req.body.userCanLogin,
                'userCanSettings': req.body.userCanSettings,
                'forgotPassword': req.body.forgotPassword
            }
        }).then((settings) => {
            res.status(200)
                .json({
                    message: 'Updated Settings',
                    result: settings
                })
        })
});
module.exports = router;