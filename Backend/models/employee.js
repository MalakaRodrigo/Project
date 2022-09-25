const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema: EmployeeSchema
const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    profileImage : {
        type:String,
        required:false
    },
    department :{
        type : String,
        required : false
    },
    designation : {
        type:String,
        required :true
    },
    notes : {
        type:String,
        required :false
    }
})

//Document name: 'employee'
module.exports = Employee = mongoose.model('employee',EmployeeSchema);