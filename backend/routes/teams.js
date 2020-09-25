const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Teams = require('../models/teams');


router.post('', checkAuth, (req, res, next) => {

    const teams = new Teams({
        name: req.body.name,
        members: req.body.members,
        home: req.body.home,
        created_ts: req.body.created_ts,
        created_by: req.userData.userId
    });
    teams.save()
        .then(document => {
            res.status(201)
                .json({
                    message: 'Teams Created Successfully',
                    result: document
                })
        });
});


router.get('', checkAuth, (req, res, next) => {
    Teams.find()
        .populate('members')
        .populate('created_by')
        .then(teams => {
            res.status(200)
                .json({
                    message: 'Teams Fetched successfully',
                    result: teams
                })
        });
});

router.get('/:id', checkAuth, (req, res, next) => {

    Teams.findById(req.params.id)
        .populate('members')
        .populate('created_by')
        .then(teams => {
            res.status(200)
                .json({
                    message: 'Teams By Id Fetched Successfully',
                    result: teams
                });
        });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Teams.deleteOne({_id: req.params.id})
        .then(teams => {
            res.status(200)
                .json({
                    message: 'Teams Deleted',
                    result: teams
                });
        });
});

module.exports = router;