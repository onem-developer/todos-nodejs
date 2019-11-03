
const logger = require('debug-level')('todos')
const express = require('express')
const api = express.Router()
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const { loadTemplate } = require('onemsdk').parser
const { Response } = require('onemsdk')

const TodoSchema = require('../models/Model').TodoSchema
const Todo = mongoose.model('todos', TodoSchema)
const jwt = require('jwt-simple')

const TEMPLATES_PATH = './src/app_api/templates/'

const templates = {
    LANDING_MENU : `${TEMPLATES_PATH}todoLanding.pug`,
    VIEW_MENU : `${TEMPLATES_PATH}todoView.pug`,
    DONE_MENU : `${TEMPLATES_PATH}todoDone.pug`,
    TODO_FORM : `${TEMPLATES_PATH}todoForm.pug`,
    DESC_FORM : `${TEMPLATES_PATH}todoDescriptionForm.pug`,
    DATE_FORM : `${TEMPLATES_PATH}todoDuedateForm.pug`
}

/*
 * Middleware to grab user
 */
function getUser(req, res, next) {
    if (!req.header('Authorization')) {
        logger.error("missing header")
        return res.status(401).send({ message: 'Unauthorized request' })
    }
    const token = req.header('Authorization').split(' ')[1]
    const payload = jwt.decode(token, process.env.TOKEN_SECRET)

    if (!payload) {
        return res.status(401).send({ message: 'Unauthorized Request' })
    }
    req.user = payload.sub
    next()
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const landingMenuData = async function (user) {
    return new Promise((resolve, reject) => {
        const result = {
            doneCount: 0,
            todoCount: 0,
            todos: [],
        }
        Todo.countDocuments({ user: user, status: 'done' }).then(function (count) {
            result.doneCount = count
            return Todo.countDocuments({ user: user, status: 'todo' })
        }).then(function (count) {
            result.todoCount = count
            return Todo.find({ user: user, status: 'todo' })
        }).then(function (todos) {
            result.todos = todos
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })
}

/*
 * Routes
 */
// Landing menu
api.get('/', getUser, async function (req, res) {
    const data = await landingMenuData(req.user)
    let rootTag = loadTemplate(templates.LANDING_MENU, data)
    let response = Response.fromTag(rootTag)
    res.json(response.toJSON())
})

// Todo view menu
api.get('/view/:id', getUser, function (req, res) {
    Todo.findOne({ _id: ObjectId(req.params.id) }).then(function (todo) {
        // viewMenu.data = todo
        let rootTag = loadTemplate(templates.VIEW_MENU, todo)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    })
})

api.get('/todoListdone', getUser, function (req, res) {
    Todo.find({ status: 'done', user: req.user }).then(async function (todos) {
        if (todos.length > 0) {

            const data = {todos : todos}
            let rootTag = loadTemplate(templates.DONE_MENU, data)
            let response = Response.fromTag(rootTag)
            res.json(response.toJSON())

        } else {
            const data = await landingMenuData(req.user)
            data.preBody = "No tasks in done status"
            let rootTag = loadTemplate(templates.LANDING_MENU, data)
            let response = Response.fromTag(rootTag)
            res.json(response.toJSON())
        }
    })
})

api.get('/form/new', getUser, function (req, res) {
    let rootTag = loadTemplate(templates.TODO_FORM)
    let response = Response.fromTag(rootTag)
    res.json(response.toJSON())
})

api.get('/form/desc', getUser, function (req, res) {
    let rootTag = loadTemplate(templates.DESC_FORM)
    let response = Response.fromTag(rootTag)
    res.json(response.toJSON())
})

api.put('/todoSetDuedate/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { dueDate: req.body.dueDate } },
        { new: true }).then(async function (todo) {
            const data = await landingMenuData(req.user)
            let rootTag = loadTemplate(templates.LANDING_MENU, data)
            let response = Response.fromTag(rootTag)
            res.json(response.toJSON())
        })
})

api.put('/todoDone/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { status: 'done' } },
        { new: true }).then(async function (todo) {
            const data = await landingMenuData(req.user)
            let rootTag = loadTemplate(templates.LANDING_MENU, data)
            let response = Response.fromTag(rootTag)
            res.json(response.toJSON())
        })
})

api.put('/todoTodo/:id', getUser, function (req, res) {
    Todo.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        { $set: { status: 'todo' } },
        { new: true }).then(async function (todo) {
            const data = await landingMenuData(req.user)
            let rootTag = loadTemplate(templates.LANDING_MENU, data)
            let response = Response.fromTag(rootTag)
            res.json(response.toJSON())
        })
})

api.delete('/:id', getUser, function (req, res) {
    Todo.deleteOne({ _id: ObjectId(req.params.id) }).then(async function (todo) {
        const data = await landingMenuData(req.user)
        let rootTag = loadTemplate(templates.LANDING_MENU, data)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    })
})

api.post('/todoAdd', getUser, function (req, res) {
    logger.info("/todoAdd")
    logger.info("body:")
    logger.info(req.body)
    let todo = new Todo()
    todo.user = req.user
    todo.taskDescription = capitalize(req.body.description)
    todo.dueDate = req.body.dueDate
    todo.status = 'todo'
    todo.save(async function (err, todo) {
        const data = await landingMenuData(req.user)
        let rootTag = loadTemplate(templates.LANDING_MENU, data)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    })
})

api.post('/todoAddDesc', getUser, function (req, res) {
    logger.info("/todoAddDesc")
    let todo = new Todo()
    todo.user = req.user
    todo.taskDescription = capitalize(req.body.description)
    todo.status = 'todo'
    todo.save(function (err, todo) {
        const data = {todo : todo}
        let rootTag = loadTemplate(templates.DATE_FORM, data)
        let response = Response.fromTag(rootTag)
        res.json(response.toJSON())
    })
})

module.exports = api
