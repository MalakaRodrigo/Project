import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Dashboard.css";
import Clockin from "./Clockin";
import Timelines from "./Timelines";
import Sidebar from "./sideBar";
import Overdue from "./Overdue";

const axios = require("axios").default;

function Dashboard({ id, email, name ,workisornot}) {
  const [Time, Settime] = useState({ Hours: "", Minutes: "", seconds: "" });
  const [workdetals, Setworkdetails] = useState({ id: "", projectname: "", taskname: "", memo: "", starttime: new Date() })
  const [timeLeft, setTimeLeft] = useState({ Hours: "00", Minutes: "00", seconds: "00" });
  const [showform, Setvisible] = useState(false);
  const [isworking, setstatus] = useState(false);
  
  

  async function stopwork() {
     await axios.put("http://localhost:8070/dashboard/update/" + workdetals.id).then(function (response) {
      setstatus(false);
      sessionStorage.removeItem('workdata');
      sessionStorage.removeItem('stime');
      Setvisible(false);
      window.location.reload(false);
    })
  }
  async function totaltime() {
     await axios
      .get("http://localhost:8070/dashboard/total/" + id)
      .then(function (response) {
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
      });
  }
 
  function work(workdata) {
    Setworkdetails({ id: workdata._id, projectname: workdata.projectname, taskname: workdata.taskname, memo: workdata.memo, starttime: new Date() })
  }

  const calculatetime = () => {
    let current = new Date();
    let difference = current.getTime() - workdetals.starttime.getTime();

    let timepassed = {};
    let h = "", m = "", s = "";
    if (Math.floor((difference / (1000 * 60 * 60)) % 24).toString().length < 2) {
      h = ("0" + Math.floor((difference / (1000 * 60 * 60)) % 24).toString());
    } else {
      h = Math.floor((difference / (1000 * 60 * 60)) % 24).toString();
    }
    if (Math.floor(Math.floor((difference / 1000 / 60) % 60)).toString().length < 2) {
      m = "0" + Math.floor((difference / 1000 / 60) % 60).toString();
    } else {
      m = Math.floor((difference / 1000 / 60) % 60).toString();
    }
    if (Math.floor((difference / 1000) % 60).toString().length < 2) {
      s = ("0" + Math.floor((difference / 1000) % 60).toString());
    } else {
      s = Math.floor((difference / 1000) % 60).toString();
    }
    timepassed = {
      Hours: h,
      Minutes: m,
      seconds: s
    };
    return timepassed;

  
  }
 

  const containerstyle = {
    position: "relative",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    left: "50%"
  };
  const circlestyleon = {
    dispay: "block",
    width: "300px",
    height: "300px",
    border: "10px solid #1e272e",
    borderTop: "10px solid #FF5349 ",
    borderRadius: "50%",
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    left: 0,
    boxShadow: "0px 3px 10px 1px rgb(250, 12, 4)"
  };
  const circlestyleoff = {
    dispay: "block",
    width: "300px",
    height: "300px",
    border: "10px solid  #FF5349",
    borderRadius: "50%",
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    left: 0,

  };
  
  const spinTransisiton = {
    loop: Infinity,
    duration: 1,
    ease: "linear",
  };
  function show() {
    if (showform) {
      Setvisible(false);
    } else {
      Setvisible(true);
    }
  }
  useEffect(() => {
    totaltime();
    const workingdetails = sessionStorage.getItem("workdata");
    const timedetails = sessionStorage.getItem("stime");
    if (workingdetails && timedetails) {
      const foundwork = JSON.parse(workingdetails)
      Setworkdetails({ id: foundwork._id, projectname: foundwork.projectname, taskname: foundwork.taskname, memo: foundwork.memo, starttime: new Date(timedetails) })
      setstatus(true);
    }
  },[]);
  useEffect(() => {
    document.title = "PROJECT";
    
  }, [])

  useEffect(() => {
    if (isworking) {
      setTimeout(() => {
        setTimeLeft(calculatetime());
      }, 1000);
     
    }
  });
 

  

  

  return (


    <div className="dashMainComponent hides">
      <div className="col-12">
        <div >
          <Sidebar email={email} id={id} />
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="row">
            <div className=" col-sm-12  ">
              
              <div 
                style={containerstyle}
                className="bg-dark bg-gradient mt-3  ms-4"
              >
                {isworking ? (
                  <motion.span
                    style={circlestyleon}
                    animate={{ rotate: 360 }}
                    transition={spinTransisiton}
                  />
                ) : (
                  <motion.span style={circlestyleoff} />
                )}

                {!isworking && !workisornot ? (
                  <p className="text">
                    Total Time Worked
                    <br />
                    <div className="timeworkedtext">
                    {Time.Hours}:{Time.Minutes}:{Time.seconds}
                    </div>
                    <br />
                  </p>
                ) : (
                  <p className="text">
                    Time Worked
                    <br />
                    <div className="timeworkedtext">
                    {timeLeft.Hours}:{timeLeft.Minutes}:{timeLeft.seconds}
                    </div>
                    <br />
                  </p>
                )}
              </div>
             
              <div className="row ">
              <div className="ms-5  ">
                {showform ? (
                  <div>
                    <button
                      className="btn btn-danger bg-gradient  buttonclock  ms-3 "
                      onClick={show}
                    >
                      Clock in
                    </button>
                    <Clockin
                      email={email}
                      id={id}
                      show={show}
                      name={name}

                      workdetails={work}
                      setstatus={setstatus}
                    />
                  </div>
                ) : isworking ? (
                  <div>
                    {" "}
                    <button
                      className="btn btn-danger bg-gradient  buttonclock ms-3"
                      onClick={stopwork}
                    >
                      Clock out
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-danger bg-gradient buttonclock "
                    onClick={show}
                  >
                    Clock In
                  </button>
                )}

              </div>
            </div>
            </div>
           
          </div>
        </div>
        
        <Timelines id={id} email={email} />
        
      </div>
      <div className="col-sm-12 col-md-9  overdue mt-5 ">
              <Overdue id={id} />
            </div>
    </div>

  );
}

export default Dashboard;
