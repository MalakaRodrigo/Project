import axios from "axios";
import React, { useState, useEffect } from "react";
import "./sideBarStyle.css"

function SideBar({id,email}) {
  const[totalcompletedtasks,setcompletedt]=useState();
  const[totalcompletedprojects,setcompletedp]=useState();
  const[totalpending,setpending]=useState();

  async function getdetails(){
  await axios.get("http://localhost:8070/dashboard/totalt/"+id).then(function(response1){
      setcompletedp(response1.data.completedp);
    })
  
 await axios.get("http://localhost:8070/dashboard/pendingtasks/"+id).then(function(response2){
      setpending(response2.data.pendingtasks);
    })
    await axios.get("http://localhost:8070/dashboard/totaltasks/"+id).then(function(response3){
      setcompletedt(response3.data.totaltask);
    })
  }
  useEffect(()=>{
    getdetails();
},[])
    
    return (
        <div className="dashboardsidemainComponent title">
            <div className="ps-3 pe-3  mt-3">
            <a href="http://localhost:3000/tasks">
            <button className="cpbutton col-12 " >
              Total Tasks
              <div className="siderbarfont">{totalcompletedprojects}</div>
              
              
          </button>
          </a>
          </div>
          <div className="ps-3 pe-3  mt-3">
          <a href="http://localhost:3000/tasks">
            <button className="ptbutton col-12 ">
              Total Pending tasks
              <div className="siderbarfont">{totalpending}</div>
              </button>
              </a>
          </div>
          <div className="ps-3 pe-3  mt-3">
          <a href="http://localhost:3000/tasks">
            <button className="ctbutton col-12 ">
              Total Completed Tasks
              <div className="siderbarfont">{totalcompletedtasks}</div>
              </button>
              </a>
          </div>
        </div>
    )
}

export default SideBar
