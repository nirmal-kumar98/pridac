const { json } = require('body-parser');
const express = require('express');

const router = express.Router();

const Category = require('../models/category');

router.post('', (req, res, next) => {
    console.log(req.body);
    const category = new Category({
        name: req.body.name
    })
    category.save()
        .then((document) => {
            res.status(201).json({
                message: 'Category Added Successfully',
                result: document
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