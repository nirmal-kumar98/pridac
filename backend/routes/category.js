const { json } = require('body-parser');
const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const Category = require('../models/category');
const Activity = require('../models/activity');


router.post('/:date', checkAuth, (req, res, next) => {
    console.log(req.body);
    const category = new Category({
        name: req.body.name
    })
    category.save()
        .then((document) => {

            Activity.find({ user: req.userData.userId })
            .then(user => {

              console.log(user);

                user[0].activity.push({
                  date: req.params.date,
                  operation: `New Category Created`,
                  title: `${ req.body.name } Category created by ${ req.userData.email }`,
              })
              user[0].save()
                .then(() => {

                    res.status(201).json({
                        message: 'Category Added Successfully',
                        result: document
                    })
                })
            })
        });
});


router.get('', (req, res, next) => {
    Category.find()
        .populate('projects')
        .then((document) => {
            res.status(201).json({
                message: 'Category Fetched Successfully',
                result: document
            })
        });
});

router.delete('/:id', (req, res, next) => {
    Category.deleteOne({ _id: req.params.id}).then(document => {
        res.status(201).json({
            message: 'category Deleted Successfully'
        })
    })
});

module.exports = router;