const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Departments
const departmentSchema = new Schema({
    department_name : {
        type : String,
        required: true
    },
    department_desc : {
        type : String,
        required: true
    },
    designations : {
        type : [{type:String,required: false }]
    },
    employees : {
        type : [{type:String,required: false}]
    }
});

const Departments = mongoose.model('Departments',departmentSchema)
module.exports = Departments