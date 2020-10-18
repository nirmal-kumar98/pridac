const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const Projects = require('../models/projects');
const Category = require('../models/category');
const Activity = require('../models/activity');

const singleStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'backend/iconic_image')
    },
    filename: (req, file, callBack) => {
        callBack(null, `iconic_${ file.originalname }`)
    }
})

var upload = multer({ storage: singleStorage});


const multipleStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'backend/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, `image_${ file.originalname }`)
    }
})

var mulitpleUpload = multer({ storage: multipleStorage});


router.post('', checkAuth, upload.single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const projects = new Projects({
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        status: req.body.status,
        location: req.body.location,
        category: req.body.category,
        construction_date: req.body.construction_date,
        value: req.body.value,
        created_ts: req.body.created_ts,
        created_by: req.userData.email,
        iconic_image: `${url}/iconic_image/${req.file.filename}`
    });
    projects.save()
        .then((document) => {
            console.log(document);
            Category.find({ name: document.category})
                .then(category => {
                    console.log(category);
                    console.log(category[0].projects)
                    console.log(category[0].projects.length)
                    category[0].projects.push(document._id)
                    category[0].save()
                        .then(result => {
                            res.status(201)
                            .json({
                                message: 'Projects added successfully',
                                result: document
                            });
                        });
                });
        });

        Activity.find({ user: req.userData.userId })
            .then(user => {
                console.log('user', user);
                if (user.length === 0) {
                    const activity = new Activity({
                        user: req.userData.userId,
                        email_id: req.userData.email,
                        activity: {
                            date: req.body.created_ts,
                            title: `Created Project`,
                            operation: `Create New Project ${ req.body.name }, by ${ req.userData.email }`
                        }
                    })
                    activity.save();
                } else {
                    user[0].activity.push({
                        date: req.body.created_ts,
                        title: ` Create New Project ${ req.body.name }, by ${ req.userData.email }`,
                        operation: `Created Project`
                    })
                    user[0].save();
                }
            })
});

router.get('', checkAuth, (req, res, next) => {
    Projects.find()
        .then(documents => {
            res.status(200).json({
                message: 'Projects Fetched successfully',
                result: documents
            })
        })
});


router.get('/:id', checkAuth, (req, res, next) => {
    Projects.findById(req.params.id)
        .then(document => {
            res.status(201)
                .json({
                    message: 'Projects fetched by Id',
                    result: document
                })
        });
});


router.post('/:id/images/:date',checkAuth, mulitpleUpload.array('files'), (req, res, next) => {
    var urls = [];
    const url = req.protocol + '://' + req.get('host');

    const files = req.files;
    console.log(files);
    for(var i in files) {
        console.log(files[i].filename);
        urls.push(`${url}/images/${files[i].filename}`);
    }
    Projects.update({ _id: req.params.id},
        { $set: { 'images': urls}}
    )
    .then(documents => {

        Projects.findById(req.params.id)
            .then(project => {
                // console.log(project)

                Activity.find({ user: req.userData.userId })
                  .then(user => {

                user[0].activity.push({
                  date: req.params.date,
                  operation: `Uploaded Images`,
                  title: `Images Uploaded to ${ project.name }, by  ${ req.userData.email }`,
              });
              user[0].save()
                .then(() => {

                    res.status(200).json({
                        message: 'ok',
                        result: documents
                    });

                });
            });
        });
    });
});

router.delete('/:id/:date', checkAuth, (req, res, next) => {
    Projects.find({_id: req.params.id})
        .then(projects => {
            console.log(projects);
            Activity.find({ user: req.userData.userId })
            .then(user => {
                console.log('user', user);
                if (user.length === 0) {
                    const activity = new Activity({
                        user: req.userData.userId,
                        email_id: req.userData.email,
                        activity: {
                            date: req.params.date,
                            title: `Deleted  Project ${ projects[0].name }`
                        }
                    })
                    activity.save();
                } else {
                    user[0].activity.push({
                        date: req.params.date,
                        operation: `Deleted Project`,
                        title: `Deleted Project ${ projects[0].name }, by ${ req.userData.email }`
                    })
                    user[0].save();
                }
            })

        })

    Projects.deleteOne({_id: req.params.id}).then((document) => {
        res.status(201).json({
            message: 'Projects Deleted Successfully',
        })
    });

    
})

module.exports = router;