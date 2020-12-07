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


router.post('/:id/images/:date', checkAuth, mulitpleUpload.array('files'), (req, res, next) => {

    console.log(req.body);

    var urls = [];
    var over_all_urls = [];
    const url = req.protocol + '://' + req.get('host');

    const files = req.files;
    // console.log(files);
    // for(var i in files) {
    //     console.log(files[i].filename);
    //     urls.push(`${url}/images/${files[i].filename}`);
    // }
    Projects.findById(req.params.id).then(project => {
        console.log(project);
            for (var i in project.images) {
                over_all_urls.push(project.images[i]);
            }
            for(var i in files) {
                console.log(files[i].filename);
                urls.push(`${url}/images/${files[i].filename}`);
                over_all_urls.push(`${url}/images/${files[i].filename}`);
            }
            console.log(over_all_urls);
    }).then(() => {
        Projects.update({ _id: req.params.id},
        { $set: { 'images': over_all_urls}}
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

    })
    // Projects.update({ _id: req.params.id},
    //     { $set: { 'images': urls}}
    // )
    // .then(documents => {

    //     Projects.findById(req.params.id)
    //         .then(project => {
    //             // console.log(project)

    //             Activity.find({ user: req.userData.userId })
    //               .then(user => {

    //             user[0].activity.push({
    //               date: req.params.date,
    //               operation: `Uploaded Images`,
    //               title: `Images Uploaded to ${ project.name }, by  ${ req.userData.email }`,
    //           });
    //           user[0].save()
    //             .then(() => {

    //                 res.status(200).json({
    //                     message: 'ok',
    //                     result: documents
    //                 });

    //             });
    //         });
    //     });
    // });
});

router.delete('/:id/:date/:category', checkAuth, (req, res, next) => {
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

        Category.find({ name: req.params.category})
            .then((category) => {

                const proj = [];

                for(var i = 0; i < category[0].projects.length; i++) {
                    if (String(category[0].projects[i]) !== req.params.id) {
                        proj.push(category[0].projects[i])
                    }
                }

                category[0].projects = proj;
                category[0].save()
                    .then(() => {
                        res.status(201).json({
                            message: 'Projects Deleted Successfully',
                        });
                    });
            });
    });

})

router.post('/update/:id', checkAuth, (req, res, next) => {

    Projects.update({ _id: req.params.id},
        { $set: { 
                    'images': req.body.images,    

                }
        }
    ).then(document => {
        res.status(200).json({
            message: 'Images Deleted Successfully'
        })
    })

})

router.post('/edit/:id/:date/:category', checkAuth, upload.single('iconic_image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    console.log(req.file);
    Activity.find({ user: req.userData.userId })
    .then(user => {

      console.log(user);

        user[0].activity.push({
          date: req.params.date,
          operation: `Updated Iconic Image`,
          title: `${ req.body.name }'s Iconic Image Updated by ${ req.userData.email }`,
      })
      user[0].save()
        .then(() => {
            Projects.update({ _id: req.params.id},
                { $set: { 'name': req.body.name,
                           'code': req.body.code,
                            'description': req.body.description,
                            'status': req.body.status,
                            'location': req.body.location,
                            'category': req.body.category,
                            'construction_date': req.body.construction_date,
                            'value': req.body.value,
                            'created_ts': req.body.created_ts,
                            'iconic_image': `${url}/iconic_image/${req.file.filename}`
                        }
                }
            ).then(document => {

                Category.find({ name: req.params.category})
                    .then((category) => {

                        console.log(category[0].projects);
                        const proj = [];

                        for(var i = 0; i < category[0].projects.length; i++) {
                            
                            if (String(category[0].projects[i]) !== req.params.id) {
                                proj.push(category[0].projects[i])
                            }
                        }

                        console.log(proj);
                        category[0].projects = proj;
                        category[0].save()
                            .then(() => {
                                Category.find({ name: req.body.category})
                                    .then((categories) => {
                                        categories[0].projects.push(req.params.id);

                                        categories[0].save()
                                            .then(() => {

                                                res.status(200)
                                                .json({
                                                    message: 'updated',
                                                    result: document
                                                });

                                            })
                                    });
                            });
                    });

            });
    })
    
    })
    

});


router.post('/editString/:id/:date/:category', checkAuth, (req, res, next) => {
    // const url = req.protocol + '://' + req.get('host');
    // console.log(req.file);
    console.log(req.body);

    Activity.find({ user: req.userData.userId })
    .then(user => {

      console.log(user);

        user[0].activity.push({
          date: req.params.date,
          operation: `Updated Details`,
          title: `${ req.body.name }'s Details Updated by ${ req.userData.email }`,
      })
      user[0].save()
        .then(() => {


            Projects.update({ _id: req.params.id},
                { $set: { 'name': req.body.name,
                           'code': req.body.code,
                            'description': req.body.description,
                            'status': req.body.status,
                            'location': req.body.location,
                            'category': req.body.category,
                            'construction_date': req.body.construction_date,
                            'value': req.body.value,
                            'created_ts': req.body.created_ts,
                            'iconic_image': req.body.iconic_image
                        }
                }
            ).then(document => {

                Category.find({ name: req.params.category})
                    .then((category) => {

                        console.log(category[0].projects);
                        const proj = [];

                        for(var i = 0; i < category[0].projects.length; i++) {
                            
                            if (String(category[0].projects[i]) !== req.params.id) {
                                proj.push(category[0].projects[i])
                            }
                        }

                        console.log(proj);
                        category[0].projects = proj;
                        category[0].save()
                            .then(() => {
                                Category.find({ name: req.body.category})
                                    .then((categories) => {
                                        categories[0].projects.push(req.params.id);

                                        categories[0].save()
                                            .then(() => {

                                                res.status(200)
                                                .json({
                                                    message: 'updated',
                                                    result: document
                                                });

                                            })
                                    });
                            });
                    });
            });

        })
    })

});

module.exports = router;