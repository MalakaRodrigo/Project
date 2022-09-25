import React, { useState, useEffect } from "react";
import axios from "axios";
import "./timeLogs.css"



function TimeLogsSideBar({email,id}) {
  const [projectdata, setprojecttimeline] = useState([]);
  const [projectselected, setproject] = useState("");
  const[tasks,settasks]=useState([""]);
  const [pid,setpid]=useState([""]);
  const[stask,setselected]=useState("");
  const [Time, Settime] = useState({ Hours: "", Minutes: "", seconds: "" });
  const [taskTime, Settasktime] = useState({ Hours: "", Minutes: "", seconds: "" });
  async function getprojects(){
    await axios.get("http://localhost:8070/employee/projects/"+email).then(function(response){
     
   
     if (response.data.length>0){
       setprojecttimeline(response.data.map(project=>project.name))
     }

    })
  }
  async function getpids(){
    await axios.get("http://localhost:8070/dashboard/getpid/"+projectselected).then(function(getid){
    const pidof=getid.data;
     setpid(pidof);
     })
  }
  async function projecttotal(){
    await axios.get("http://localhost:8070/Dashboard/totalprojectwise?id="+ id+"&"+"projectname="+projectselected).then(function(response){
      let h = "", m = "", s = "";
        if (response.data.totalhours.toString().length < 2) {
          h = ("0" + response.data.totalhours.toString());
        } else {
          h = response.data.totalhours.toString();
        }
        if (response.data.totalminutes.toString().length < 2) {
          m = "0" + response.data.totalminutes.toString();
        } else {
          m = response.data.totalminutes.toString();
        }
        if (response.data.totalseconds.toString().length < 2) {
          s = ("0" + response.data.totalseconds.toString());
        } else {
          s = response.data.totalseconds.toString();
        }
        Settime({
          Hours: h,
          Minutes: m,
          seconds: s,
        });
       
        })
  }
  async function tasktotal(){
    await axios.get("http://localhost:8070/Dashboard/totaltaskwise?id="+ id+"&"+"taskname="+stask).then(function(response){
      let h = "", m = "", s = "";
        if (response.data.totalhours.toString().length < 2) {
          h = ("0" + response.data.totalhours.toString());
        } else {
          h = response.data.totalhours.toString();
        }
        if (response.data.totalminutes.toString().length < 2) {
          m = "0" + response.data.totalminutes.toString();
        } else {
          m = response.data.totalminutes.toString();
        }
        if (response.data.totalseconds.toString().length < 2) {
          s = ("0" + response.data.totalseconds.toString());
        } else {
          s = response.data.totalseconds.toString();
        }
        Settasktime({
          Hours: h,
          Minutes: m,
          seconds: s,
        });
        })
  }
  async function gettasks(){
    await axios.get("http://localhost:8070/dashboard/gettasksbyprojectandemployee?id="+id+"&pid="+pid).then(function(response){
     if (response.data.tasksummery.length>0){
       settasks([""]);
       settasks(response.data.tasksummery);
      
     }else{
      settasks([""]);
     }

    })
  }
useEffect(() => {
getprojects();
getpids();
gettasks();
projecttotal();
tasktotal();


}, [projectselected,stask,pid]);
  return (
    <div>
       <div className="timelogsComponent title">
            
            <div className="ps-3 pe-3  mt-3">
             
            <div className="timelogcpbutton col-12 " >
            
           
            <select className=" form-select form-select-sm text-center dropdownfonts " defaultValue={""} onChange={(e) =>
                  setproject( e.target.value)} >
                    <option disabled  value={""} > Select Project </option>
              {projectdata.map(item => {
                return (<option  key={item} value={item}>{item}</option>);
              })}
            </select>
            <div className="timefont">{Time.Hours}:{Time.Minutes}:{Time.seconds}</div>
            </div></div>
    

    
        <div className="ps-3 pe-3  mt-3">
          <div className="timelogptbutton col-12 " >
          
          <select className="form-select form-select-sm text-center dropdownfonts " defaultValue={""} onChange={(e) =>
                  setselected( e.target.value)} >
                    <option disabled  value={""} >  Select Task  </option>
              {tasks.map(item => {
                return (<option  key={item} value={item}>{item}</option>);
              })}
            </select>
            <div className="timefont">{taskTime.Hours}:{taskTime.Minutes}:{taskTime.seconds}</div>
        </div>
        </div>
        
      </div>
    </div>
  )
}

export default TimeLogsSideBar

