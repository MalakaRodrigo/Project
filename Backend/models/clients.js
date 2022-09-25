const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Project = require('./projects')
// Create Schema for Departments
const clientsSchema = new Schema({
    clientName : {
        type : String,
        required: true
    },
    projects : {
        type:[{type:String,required:false}]
    },
    meetings : {
      type:[
          {
              date:{type:Date,required:true},
              venue:{type:String,required:false},
              description:{type:String,required:false}
          }
      ]
    },
    email:{type:String,required:true}
});

const Clients = mongoose.model('Clients',clientsSchema)
module.exports = Clients