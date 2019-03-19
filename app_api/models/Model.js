
var Mongoose = require('mongoose');

exports.TodoSchema = new Mongoose.Schema({
    taskDescription: { type: String },
    dueDate: { type: String },
    status: { type: String } 
}, {
    timestamps: true
});
