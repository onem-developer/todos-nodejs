
const mongoose = require('mongoose');
const onem = require('onem');

var Todo = mongoose.model('todos', TodoSchema);
var todo = new onem.service("TODO");

/*
 * Todo Landing menu 
 */
var landingMenuOptions = [
    { type: "content", template: "{{this.preBody}}”},
    { type: "option", template: "New todo", nextRoute: "landing", action: "addTodo" },
    { type: "option", template: "Done {{/todo/doneCount}}", nextRoute: "doneMenu" },
    { type: "content", template: "Todo {{/todo/pendingCount}}" },
    { type: "dynamicOptions", routeOptions: "/todos", nextRoute: "todoViewMenu($routeOption)" }
];
var landingMenu = todo.createMenuTemplate("landing", landingMenuOptions);
landingMenu.setHeader("TODO MENU");

/*
 * Todo View menu 
 */
var todoViewMenu = [
    { type: "content", template: "Task: {{this.task}}" },
    { type: "content", template: "Due: {{this.dueDate}}" },
    { type: "option", template: "Mark as done", action: "/todo/{id}", actionMethod: "PUT", body: "{status: ‘done’}", nextRoute: "landing({preBody:'Marked as Done'})" },
    {
        type: "option", template: "Delete", action: "/todo/{id}", actionMethod: "DELETE", body: "{}", nextRoute: "landing({preBody: 'Task was deleted'})"
    }
];
var todoViewMenu = todo.createMenuTemplate("todoViewMenu", todoViewMenu);
todoViewMenu.setHeader("TODO VIEW");

/*
 * Todo add new todo wizard
 */
var todoWizardData = [
    { name: "taskDescription", prompt: "Provide a task description", type: "string", footer: "Reply with description or MENU" },
    { name: "dueDate", prompt: "Provide due date", type: "date", footer: "Reply with date" }
];
todo.createWizard("addTodo", todoWizardData, "/todo", "POST");

/*
 * Routes
 */
api.get('/todo/doneCount', todo.doneCount(Todo));
api.get('/todo/pendingCount', todo.pendingCount(Todo));
api.get('/todos', todo.listPendingTodos(Todo));

api.post('/todo', function (req, res) {
    var todo = new Todo();
    todo.taskDescription = req.body.taskDescription;
    todo.dueDate = req.body.dueDate;
    todo.save(function (err, todo) {
        if (err) {
            debug(err);
            return res.status(500).send({ message: 'Server error' });
        }
        res.send({ result: todo });
    });
});


