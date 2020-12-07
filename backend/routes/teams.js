const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Teams = require('../models/teams');
const Activity = require('../models/activity');
const Users = require('../models/users');

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

            Activity.find({ user: req.userData.userId })
                  .then(user => {

                user[0].activity.push({
                  date: req.body.created_ts,
                  operation: `Created Teams`,
                  title: `Created New Teams as ${ req.body.name }`,
              })
              user[0].save()
                .then(() => {
                    const members = document.members;

                    for(var i = 0; i < members.length; i++) {

                        Users.findById(members[i])
                        .then(userTeams => {
                            userTeams.teams.push(document._id)
                            userTeams.save()
                                .then(() => {
                                    res.status(201)
                                    .json({
                                        message: 'Teams Created Successfully',
                                        result: document
                                    })
                                })
                            })

                    }

                    })
            });


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

router.delete('/:id/:date', checkAuth, (req, res, next) => {

    Teams.findById(req.params.id)
        .then(teams => {

            Activity.find({ user: req.userData.userId })
                  .then(user => {

                user[0].activity.push({
                  date: req.params.date,
                  operation: `Deleted Teams`,
                  title: `Deleted ${ teams.name }`,
              })
              user[0].save().then(() => {

                Teams.deleteOne({_id: req.params.id})
                .then(teams => {
                    res.status(200)
                        .json({
                            message: 'Teams Deleted',
                            result: teams
                        });
                });

              });

            });
        })

});

router.post('/edit/:id/:date', checkAuth, (req, res, next) => {

    Activity.find({ user: req.userData.userId })
    .then(user => {

      console.log(user);

        user[0].activity.push({
          date: req.params.date,
          operation: `Updated Teams`,
          title: `Team ${ req.body.name } Updated,  by ${ req.userData.email }`,
      })
      user[0].save()
        .then(() => {

            Teams.update({ _id: req.params.id},
                { $set: { 'name': req.body.name,
                           'members': req.body.members,
                           'home': req.body.home
                 }
               }).then(document => {
                 res.status(200)
                   .json({
                     message: 'Teams Updated Successfully',
                     result: document
                   });
               });
        });
    });
  
});

module.exports = router;