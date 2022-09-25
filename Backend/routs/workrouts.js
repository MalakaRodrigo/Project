const express = require("express");
const router = express.Router();

//work model
const Workingproject = require("../models/working");
const Employee = require("../models/employee");
const Task = require('../models/task');
const Project = require('../models/projects');
const { Router } = require("express");
const working = require("../models/working");
const Clients = require('../models/clients')

router.post("/record", (req, res) => {
  const { projectname, taskname, memo } = req.body;
  const starttime = new Date();

  //Validation
  if (!projectname || !taskname || !memo) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  let id=req.query.id;
  let name=req.query.name;
  const newwork = new Workingproject({
    id:id,
    name:name,
    projectname: req.body.projectname,
    taskname: req.body.taskname,
    memo: req.body.memo,
    Stime: starttime,
    Etime: starttime,
    hours:0,
    minutes:0,
    seconds:0
  });

  newwork
    .save()

    .then(console.log("Success"))
    .catch((err) => {
      console.log("Not saved");
    });

  res.json(newwork);
});


router.put("/update/:id", (req, res) => {
  //update ended time
  const endtime = new Date();
  Workingproject.findOne({ _id: req.params.id }).then((project) => {
    if (!project) return res.status(400).json({ msg: "No record Matching" }); //check for same ID
    let total=(endtime.getTime()-project.Stime.getTime());
    let hours=Math.trunc(total / 3600000);
    total=total%3600000;
    let minutes=Math.trunc(total / 60000);
    total=total%60000;
    let seconds=Math.trunc(total / 1000);

    project.Etime = endtime;
    project.hours=hours;
    project.minutes=minutes;
    project.seconds=seconds;
    project
      .save()
      .then(console.log("Updated"))
      .catch((err) => {
        console.log("error");
      });
    res.json(project);
  });
});


router.get("/total/:id", (req, res) => {
  const id = req.params.id;//get id
  let totalhours = 0,totalminutes = 0,totalseconds = 0,single=0;
  Workingproject.find({ id:id }).then((work) => {//findall matching email in workings
    if (work) {
      let iter = work.values();
      for (let times of iter) {
        totalhours += times.hours ;
        totalminutes += times.minutes;
        totalseconds += times.seconds;   
        if(totalseconds>59){
          totalminutes++;
          totalseconds-=60;
        }
        if(totalminutes>59){
          totalhours++;
          totalminutes-=60;
        }   
      }
     
      return res.json({
        totalhours:totalhours,
        totalminutes:totalminutes,
        totalseconds:totalseconds
      });
    }
  });
});
router.get("/summery/:id", (req, res) => {
  const id = req.params.id;//get email
 
  Workingproject.find({ id:id }).then((work) => {//findall matching id in workings
    if (work) {
      let summery=[]
      let iter=work.values();
      for (let times of iter) {
       let obj=[times.projectname,times.taskname,times.Stime.toString().substring(3,24),times.Etime.toString().substring(3,24)];
        summery.push(obj);
      }
      summery=summery.reverse();
      return res.json(
        {summery}
      );
    }
  });
});

router.get("/projectsummery", (req, res) => {
  
  let id=req.query.id;
  let projectn=req.query.projectname
  Workingproject.find({ id:id}).then((work) => {//findall matching id in workings
    if (work) {
      let summery=[]
      let iter=work.values();
      for (let times of iter) {
        if(times.projectname==projectn){
       let obj=[times.projectname,times.taskname,times.Stime.toString().substring(3,24),times.Etime.toString().substring(3,24)];
        summery.push(obj);
        }
      }
      summery=summery.reverse();
      return res.json(
        {summery}
      );
    }
  });
});

router.get("/gettasksbyprojectandemployee",(req,res)=>{//get task by project and assigned employee
  let id=req.query.id;
  let projectn=req.query.pid;
  Task.find({assigned_to:id}).then((work)=>{
    if(work){
      let tasksummery=[]
      let iter=work.values();
      for (let times of iter) {
        if(times.project_id==projectn&& times.task_status!="Done"){
        tasksummery.push(times.task_name);
        }
      }
      return res.json({
        tasksummery
      });
    }
  })
});

router.get("/getpid/:projectname",(req,res)=>{//get project id by name
  const projectname=req.params.projectname;
  Project.findOne({name:projectname}).then((pro)=>{
    if(pro){
      return res.json(pro._id);
    }
  })
})

router.get("/getoverduetasks/:id",(req,res)=>{//get overdue tasks
  const id=req.params.id;
  Task.find({assigned_to:id}).then((overdue)=>{
    let overdued=[]
    let count=1;
    if(overdue){
      let iter=overdue.values()
      
      for(let times of iter){
        if(times.due_date<new Date()&&times.task_status!="Done"){
          let obj=[count.toString()+". "+times.task_name+" Due date was on  "+ times.due_date.toString().substring(3,15)];
          overdued.push(obj);
          count++;
        }
      }

    }
    return res.json(overdued)
  })
})

router.get("/totaltasks/:id",(req,res)=>{//get total tasks by id
  const id=req.params.id;
  let totaltask=0;
  Task.find({assigned_to:id ,task_status:"Done"}).then((totalcompletedtasks)=>{
    if(totalcompletedtasks){
    totaltask=totalcompletedtasks.length;
   return res.json({totaltask});
    }
  })
  
 
})
router.get ('/projectsincompleted/:email',(req, res)=>{
  let email = req.params.email;
 //Check for existing user
 Project.find({members: email}).then(projects=>{
    if (projects) {
    let iter=projects.values();
    let obj=[];
    for(let times of iter){
      if(times.projectStatus!="Completed"){
        obj.push(times);
      }
    }
    return res.json(obj);
  }
   })
 });
router.get("/pendingtasks/:id",(req,res)=>{//get all pending tasks by id
  const id=req.params.id;
  let pendingtasks=0
  Task.find({assigned_to:id}).then((notcompletedtasks)=>{
    if(notcompletedtasks){
      let iter=notcompletedtasks.values();
      for(let times of iter){
        if(times.task_status!="Done"){
          pendingtasks++;
        
        }
      }
     return res.json({pendingtasks});
    }
  })

})

router.get("/totalt/:id",(req,res)=>{//get total tasks by email
  const id=req.params.id;
  let completedp=0;
  Task.find({assigned_to:id}).then((completed=>{
    if(completed){
      completedp=completed.length;
      
    }
    return res.json({completedp});
  }))

})

//for timelogs
router.get("/timelogs/",(req,res)=>{
  Workingproject.find({}).then((timeline)=>{
    let summery=[]
      let iter=timeline.values();
      for (let times of iter) {
        let duration="";
        if(times.hours>=10){
          duration+=times.hours.toString()+":";
        }else{
          duration+="0"+times.hours.toString()+":";
        }
        if(times.minutes>=10){
          duration+=times.minutes.toString()+":"
        }else{
          duration+="0"+times.minutes.toString()+":"
        }
        if(times.seconds>=10){
          duration+=times.seconds.toString();
        }else{
          duration+="0"+times.seconds.toString();
        }
      
       let obj=[times.name,times.projectname,times.taskname,times.Stime.toString().substring(3,24),times.Etime.toString().substring(3,24),duration,times.memo];
        summery.push(obj);
      
    }
    return res.json(summery.reverse());
  }).catch(error=>{
    return res.json("error");
  })
})
router.get("/totalprojectwise", (req, res) => {
  let id=req.query.id;
  let projectn=req.query.projectname
  let totalhours = 0,totalminutes = 0,totalseconds = 0,single=0;
  Workingproject.find({ id:id,projectname:projectn }).then((work) => {//findall matching email in workings
    if (work) {
      let iter = work.values();
      for (let times of iter) {
        totalhours += times.hours ;
        totalminutes += times.minutes;
        totalseconds += times.seconds;   
        if(totalseconds>59){
          totalminutes++;
          totalseconds-=60;
        }
        if(totalminutes>59){
          totalhours++;
          totalminutes-=60;
        }   
      }
     
      return res.json({
        totalhours:totalhours,
        totalminutes:totalminutes,
        totalseconds:totalseconds
      });
    }
  });
});
router.get("/totaltaskwise", (req, res) => {
  let id=req.query.id;
  let taskn=req.query.taskname
  let totalhours = 0,totalminutes = 0,totalseconds = 0,single=0;
  Workingproject.find({ id:id,taskname:taskn }).then((work) => {
    if (work) {
      let iter = work.values();
      for (let times of iter) {
        totalhours += times.hours ;
        totalminutes += times.minutes;
        totalseconds += times.seconds;   
        if(totalseconds>59){
          totalminutes++;
          totalseconds-=60;
        }
        if(totalminutes>59){
          totalhours++;
          totalminutes-=60;
        }   
      }
     
      return res.json({
        totalhours:totalhours,
        totalminutes:totalminutes,
        totalseconds:totalseconds
      });
    }
  });
});


//**********************************Admin Panel Componenets
//****************************************************************************/

router.get("/admintimeline/",(req,res)=>{//get total workings of all employees 
  Workingproject.find({}).then((admintimeline)=>{
    let summery=[]
      let iter=admintimeline.values();
      for (let times of iter) {
        let duration="";
        if(times.hours>=10){
          duration+=times.hours.toString()+":";
        }else{
          duration+="0"+times.hours.toString()+":";
        }
        if(times.minutes>=10){
          duration+=times.minutes.toString()+":"
        }else{
          duration+="0"+times.minutes.toString()+":"
        }
        if(times.seconds>=10){
          duration+=times.seconds.toString();
        }else{
          duration+="0"+times.seconds.toString();
        }
      
       let obj=[times.name,times.projectname,times.taskname,times.Stime.toString().substring(3,24),times.Etime.toString().substring(3,24),duration];
        summery.push(obj);
      
    }
    return res.json(summery.reverse());
  }).catch(error=>{
    return res.json("error");
  })
})

router.get("/totalprojectadmin/",(req,res)=>{//get total projects
  Project.find({}).then(number=>{
    return res.json(number.length);
  }).catch(error=>{
    return res.json("error");
  })
})

router.get("/totalemployees/",(req,res)=>{//get total employees
  Employee.find({role:0}).then(response=>{
    return res.json(response.length);
  }).catch(error=>{
    return res.json("error");
  })
})


//working time of particulr project - added by malaka
router.get("/gettotaltimeofproject/:id",(req,res)=>{//get total workings of a project
  Workingproject.find({"projectname":req.params.id}).then((admintimeline)=>{
    let summery=[]
      let iter=admintimeline.values();
      for (let times of iter) {
        let duration="";
        
        if(times.hours>=10){
          duration+=times.hours.toString()+":";
        }else{
          duration+="0"+times.hours.toString()+":";
        }
        if(times.minutes>=10){
          duration+=times.minutes.toString()+":"
        }else{
          duration+="0"+times.minutes.toString()+":"
        }
        if(times.seconds>=10){
          duration+=times.seconds.toString();
        }else{
          duration+="0"+times.seconds.toString();
        }
      
       let obj=[times.name,times.projectname,times.taskname,times.Stime.toString().substring(3,24),times.Etime.toString().substring(3,24),duration, times.memo];
        summery.push(obj);
      console.log(summery)
    }
    return res.json(summery.reverse());
  }).catch(error=>{
    return res.json("error");
  })
})

router.get("/overdueprojects/",(req,res)=>{//get overdue projects
  Project.find({}).then(response=>{
    let count=0;
    if(response){
    let iter=response.values()
      for(let times of iter){
        if(times.overdue<new Date()&&times.projectStatus!="Compeleted"){
          count++;
        }
      }

    }
    return res.json(count)
  }).catch(()=>{
    return res.json("error");
  })
})
router.get("/overduetaskstotal/",(req,res)=>{//get overdue projects
  
  Task.find({}).then((overdue)=>{
    let count=0;
    if(overdue){
    let iter=overdue.values()
      for(let times of iter){
        if(times.due_date<new Date()&&times.task_status!="Done"){
          count++;
        }
      }

    }
    return res.json(count)
  })
})
router.get("/totalclients",(req,res)=>{
  Clients.find({}).then((clients)=>{
   return res.json(clients.length);
  })
})

module.exports = router;
