
var Mongoose = require('mongoose');

exports.TodoSchema = new Mongoose.Schema({
	user: { type: String },
    taskDescription: { type: String },
    dueDate: { type: String },
    status: { type: String }
});
