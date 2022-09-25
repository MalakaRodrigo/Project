
const express = require("express");
const mongoose = require("mongoose");
const{route} = require('./routs/calendarTaskBackLogRoute');
const cors = require("cors");
const config = require("config");
require("dotenv").config();
const TaskRouts = require('./routs/taskRouts')
const DepartmentsRouts = require('./routs/departmentsRouts')
const DesignationsRouts =  require('./routs/designationsRouts')
const ClientsRouts = require('./routs/clientRouts')
const nodeCron = require("node-cron");




const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8070;

//Use routs
//http://localhost:8070/employee
app.use('/employee',require('./routs/employeeRouts.js'));


//calendar task backlog
//Router
app.use('/api', route);


//app.use('/employee/register',require('./routs/employeeRouts.js'));

app.use('/',require('./routs/projectRouts.js'));
app.use('/dashboard',require('./routs/workrouts.js'));


app.use('/employee',require('./routs/projectRouts.js'));
app.use('/dashboard',require('./routs/workrouts.js'));

app.use('/task',TaskRouts)
app.use('/departments',DepartmentsRouts)
app.use('/designations',DesignationsRouts)
app.use('/clients',ClientsRouts)
const URL = config.get("MONGODB_URI");

mongoose.connect(URL, { 
  useNewUrlParser: true,
});


//Connecting DB
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("Mongodb Connection success!");
})
const t=mongoose.model('tasks',{
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



nodeCron.schedule('59 23 * * *', async function() {
  console.log("done")
  await t.updateMany({task_status:{$ne:"Done"},due_date:{$lt:new Date()}},{$set:{task_status:"Overdue"}}); 
},
{scheduled:true,timezone:"Asia/Colombo"});


app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`)
})


