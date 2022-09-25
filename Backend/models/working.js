const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema: EmployeeSchema
const workingprojectSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name:{
    type:String,
    required:true,
  },
  projectname: {
    type: String,
    required: true,
  },
  taskname: {
    type: String,
    required: true,
  },
  memo: {
    type: String,
    required: true,
  },
  Stime: {
    type: Date
  },
  Etime: {
    type: Date
  },
  hours:{
    type:Number
  },
  minutes:{
    type:Number
  },
  seconds:{
    type:Number
  }
  
});

//Document name: 'workingproject'
module.exports = Workingproject = mongoose.model("working",workingprojectSchema);
