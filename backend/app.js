const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();


const category = require('./routes/category');
const projects = require('./routes/project');
const users = require('./routes/users');
const teams = require('./routes/teams');
const home = require('./routes/home');
const activity = require('./routes/activity');
const settings = require('./routes/settings');

mongoose.connect('mongodb+srv://clixters:clixters@2020@cluster0.a9ouy.mongodb.net/pridac-Admin?retryWrites=true&w=majority', 
                    { useNewUrlParser: true,  useUnifiedTopology: true }
    ).then(() => {
        console.log('Connected to Database!');
    })
    .catch(() => {
        console.log('Connections Failed !');
    })

    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use('/iconic_image', express.static(path.join('backend/iconic_image')));
app.use('/images', express.static(path.join('backend/images')));
app.use('/profile_pic', express.static(path.join('backend/profile_pic')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


app.use('/api/category', category);
app.use('/api/projects', projects);
app.use('/api/users', users);
app.use('/api/teams', teams);
app.use('/api/home', home);
app.use('/api/activity', activity);
app.use('/api/settings', settings)

module.exports = app;