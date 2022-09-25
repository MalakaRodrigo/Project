import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Sidebar from "./sideBar";
import "./adminDashboard.css";
// eslint-disable-next-line import/first
import Reports from "../Reports/reports";
import UserReports from "../Reports/userReports";
const axios = require("axios").default;



function AdminPanel() {
  const [projecttimeline, settimeline] = useState([]);
  const [searchterm, setsearchterm] = useState("");
  async function admintimeline() {
    await axios
      .get("http://localhost:8070/dashboard/admintimeline/")
      .then(function (response) {
        if (response.data.length > 0) {
          settimeline(response.data);
        }
      });
  }
  

  useEffect(() => {
    admintimeline();
   
    
  }, []);
  return (
    <div className="adminmain adminhides">
      <div>
        <div>
          <Sidebar />
        </div>
       <Reports/>
        
        <div className=" rowStyle row">
          <div className=" admintimeline">
            <h1 className="text-center admintableheader"> Worklogs</h1>
            <div className="searchbarplacement">
              <img
                src={require("../../../assests/images/redSearch2.png").default}
                className="searchtimlineimage"
              />
              <input
                type="text"
                placeholder=" Search by Employee, Project, Task, or Date"
                className="searchbartimline "
                onChange={(e) => setsearchterm(e.target.value)}
              />
            </div>
            {projecttimeline.length > 0 ? (
              <div className=" timelinetable adminhides">
                <ul className="  employelist mt-3 timelinetext list-group-flush">
                  {projecttimeline
                    .filter((val) => {
                      if (searchterm == "") {
                        return val;
                      } else if (
                        val[0].toLowerCase().includes(searchterm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[1].toLowerCase().includes(searchterm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[2].toLowerCase().includes(searchterm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[4].toLowerCase().includes(searchterm.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map((numList, i) => {
                     if(i%2==0){ return(<li className="table_data_oddli" key={i}>
                     {numList[0]} has Worked on {numList[1]} at {numList[3]}
                     <br/>
                     Task : {numList[2]}
                     <br />
                     Duration : {numList[5]}
                     <br/>
                   </li>)}else{ 
                     return(<li className="table_data_evenli" key={i}>
                     {numList[0]} has Worked on {numList[1]} at {numList[3]}
                     <br/>
                     Task : {numList[2]}
                     <br />
                     Duration : {numList[5]}
                     <br/>
                   </li>)
                   }
                     
            })}
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="text-center">No Records Found</h2>
              </div>
            )}
          </div> 
 {/*          <div className="col-lg-4 col-sm-12 timelinetext mt-3 overdueprojectadmin">
            {overdueprojects > 0 ? (
              <div className="row">
                <div className="col-3 text-center">
                  <img
                    className=" mt-3 nooverdueimgadmin"
                    src={require("../../../assests/images/warning.png").default}
                  />
                </div>
                <div className="col-8 ms-3">
                  <h1 className="noverdueadmin ">Overdue Projects</h1>
                  <div>
                    <p className=" overduebuttonnumber">
                      {overdueprojects}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-3 text-center">
                  <img
                    className=" mt-3 nooverdueimgadmin"
                    src={require("../../../assests/images/completed.png").default}
                  />
                </div>
                <div className="col-8 mt-5 ms-3">
                  <h1 className="noverdueadmin "> No Overdue Projects</h1>
                  
                </div>
              </div>
            )}
             {overduetasks> 0 ? (
              <div className="row">
                <div className="col-3 text-center">
                  <img
                    className=" mt-3 nooverdueimgadmin"
                    src={require("../../../assests/images/warning.png").default}
                  />
                </div>
                <div className="col-8 ms-3">
                  <h1 className="noverdueadmin ">Overdue Tasks</h1>
                  <div>
                    <p className=" overduebuttonnumber">
                      {overduetasks}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-3 text-center">
                  <img
                    className=" mt-3 nooverdueimgadmin"
                    src={require("../../../assests/images/completed.png").default}
                  />
                </div>
                <div className="col-8 mt-5 ms-3">
                  <h1 className="noverdueadmin "> No Overdue Tasks</h1>
                  
                </div>
              </div>
            )}
            
          </div> */}
          
        </div>
        <div>
         
        </div>
        
      </div>
      </div>
 
  );
}

export default withRouter(AdminPanel);
