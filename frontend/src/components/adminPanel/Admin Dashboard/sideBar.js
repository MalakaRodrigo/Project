import axios from "axios";
import React, { useState, useEffect } from "react";
import "./sideBarStyle.css"

function SideBar({id,email}) {
  const[totalcompletedtasks,setcompletedt]=useState(0);
  const[totalcompletedprojects,setcompletedp]=useState(0);
  const[totalclients,setclients]=useState(0);
  const [overdueprojects, setoverdueprojects] = useState(0);
  const[overduetasks,setoverduetasks]=useState(0);

  async function getdetails(){
  await axios.get("http://localhost:8070/dashboard//totalprojectadmin/").then(function(response){
      setcompletedp(response.data);
    })
  
 await axios.get("http://localhost:8070/dashboard/totalclients/").then(function(response){
      setclients(response.data);
    })
    await axios.get("http://localhost:8070/dashboard/totalemployees/").then(function(response){
      setcompletedt(response.data);
    })
  }
  async function overdueproject() {
    await axios
      .get("http://localhost:8070/Dashboard/overdueprojects/")
      .then(function (response) {
       
          setoverdueprojects(response.data);
        
      });
  }
  async function overduetask() {
    await axios
      .get("http://localhost:8070/Dashboard/overduetaskstotal/")
      .then(function (response) {
      
          setoverduetasks(response.data);
         
         
        
      });
  }
  useEffect(()=>{
    getdetails();
    overdueproject();
    overduetask();
},[])
    
    return (
        <div className="admindashboardsidemainComponent admintitle text-center">
           
            <div className="admincpbutton mt-3" >
              Total  Projects
              <div className="adminsiderbarfont">{totalcompletedprojects}</div> 
          </div>
         
          
            <div className="adminptbutton mt-3 ">
              Total Cilents
              <div className="adminsiderbarfont">{totalclients}</div>
              </div>
            
            <div className="adminctbutton mt-3">
              Total Employees
              <div className="adminsiderbarfont">{totalcompletedtasks}</div>
              
              
          </div>
          <div className="adminctbutton1 mt-3">
              Overdue Projects
              <div className="adminsiderbarfont">{overdueprojects}</div>
              
              
          </div>
          <div className="adminctbutton2 mt-3">
              Overdue Tasks
              <div className="adminsiderbarfont">{overduetasks}</div>
              
              
          </div>
        </div>
    )
}

export default SideBar
