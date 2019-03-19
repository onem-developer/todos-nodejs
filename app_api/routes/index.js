
const express = require('express');
const api = express.Router();
const debug = require('debug')('todos');

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Service = require('onem-nodejs-api').Service;
const TodoSchema = require('../models/Model').TodoSchema;

const APIKEY = 'o4857349ytvo5438543987498u34q9843';

const Todo = mongoose.model('todos', TodoSchema);

const todoVerbs = [
    { name: 'menu', route: '/todo' }
];
var todo = new Service(APIKEY, "TODO", todoVerbs);

var initialLandingMenuData = {
    doneCount: 0,
    todoCount: 0,
    todos: [{ id: "1", taskDescription: "Blah", dueDate: "12/3" }, { id: "2", taskDescription: "Blob", dueDate: "15/3" }]
}

var landingMenu = todo.addMenu('./app_api/templates/todoLanding.pug', initialLandingMenuData);
landingMenu.header("TODO MENU");

var viewMenu = todo.addMenu('./app_api/templates/todoView.pug');
viewMenu.header("TODO VIEW");

var doneMenu = todo.addMenu('./app_api/templates/todoDone.pug');
doneMenu.header("TODO DONE");

var descForm = todo.addForm('./app_api/templates/todoDescriptionForm.pug');
descForm.header("TODO DESCRIPTION");

var dateForm = todo.addForm('./app_api/templates/todoDueDateForm.pug');
dateForm.header("TODO DUE DATE");

/*
 * Middleware to grab user
 */
function getUser(req, res, next) {
    // if (!req.header('Authorization')) {
    //     debug("missing header");
    //     return res.status(401).send({ message: 'Unauthorized request' });
    // }
    // var token = req.header('Authorization').split(' ')[1];

    // var payload = common.decodeJWT(token);
    // debug("decoded payload");
    // debug(payload);
    // if (!payload) {
    //     return res.status(401).send({ message: 'Unauthorized Request' });
    // }
    // req.user = payload.sub;
    next();
}

var landingMenuData = async function() {
    return new Promise((resolve, reject) => {
        var result = {
            doneCount: 0,
            todoCount: 0,
            todos: [],
        };
        Todo.count({status: 'done'}).then(function(count) {
            result.doneCount = count;
            return Todo.count({status: 'todo'});
        }).then(function(count) {
            result.todoCount = count;
            return Todo.find({status: 'todo'});
        }).then(function(todos) {
            result.todos = todos;
            debug("result:");
            debug(result);
            resolve(result);
        }).catch(function(error) {
            reject(error);
        });
    });
}

/*
 * Routes
 */
// Landing menu
api.get('/todo', getUser, async function (req, res) {
    landingMenu.data = await landingMenuData();
    res.json({ data: landingMenu.render() });
});

// Todo view menu
api.get('/todo/view/:id', getUser, function (req, res) {
    Todo.findOne({ _id: ObjectId(req.params.id) }).then(function (todo) {
       // viewMenu.data = todo;
        viewMenu.data = todo;
        res.json({ data: viewMenu.render() });
    });
})

api.get('/todoListdone', getUser, function (req, res) {
    Todo.find({status: 'done'}).then(async function(todos) {
        if (todos.length > 0) {
            doneMenu.data.todos = todos;
            res.json({ data: doneMenu.render() });            
        } else {
            landingMenu.data = await landingMenuData();
            res.json({ data: landingMenu.render() });         
        }
    });
});

api.get('/todo/form/desc', getUser, function (req, res) {
    res.json({ data: descForm.render() });
});

api.put('/todoSetDuedate/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { dueDate: req.body.dueDate } },
        { new: true }).then(async function(todo) {
        landingMenu.data = await landingMenuData();
        res.json({ data: landingMenu.render() });
    });
});

api.put('/todoDone/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { status: 'done' } },
        { new: true }).then(async function(todo) {
        landingMenu.data = await landingMenuData();
        res.json({ data: landingMenu.render() });
    });
});

api.put('/todoTodo/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { status: 'todo' } },
        { new: true }).then(async function(todo) {
        landingMenu.data = await landingMenuData();
        res.json({ data: landingMenu.render() });
    });
});

api.delete('/todo/:id', getUser, function (req, res) {
    Todo.remove({ _id: ObjectId(req.params.id) }).then(async function(todo) {
        landingMenu.data = await landingMenuData();
        res.json({ data: landingMenu.render() });
    });
});

api.post('/todoAddDesc', getUser, function (req, res) {
    var todo = new Todo();
    todo.taskDescription = req.body.description;
    todo.status = 'todo';
    todo.save(function (err, todo) {
        dateForm.data.todo = todo;
        res.json({ data: dateForm.render() });
    });
});

module.exports = api;
