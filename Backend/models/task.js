const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Task
const taskSchema = new Schema({
    task_name : {
        type : String,
        required: true
    },
    due_date : {
        type : Date,
        required: true
    },
    task_status : {
        type : String,
        required: true
    },
    project_id : {
        type : String,
        required: true
    },
    project_name : {
        type : String,
        required: true
    },
    action : {
        type : String,
        required: true
    },
    assigned_to : {
        type : [{type:String,required: true }]
    }
});

const Tasks = mongoose.model('Tasks',taskSchema)
module.exports = Tasks