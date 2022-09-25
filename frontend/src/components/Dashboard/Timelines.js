import React, { useState, useEffect } from "react";
import "./Timelines.css";
const axios = require("axios").default;

function Timelines({id , email}) {
  const [data, setdata] = useState([]);
  const [projectdata, setprojecttimeline] = useState([]);
  const[pselected,setptimeline]=useState([])
  const [projectselected, setproject] = useState("");
  async function summery() {
     await axios
      .get("http://localhost:8070/Dashboard/summery/" + id)
      .then(function (response) {
        setdata(response.data.summery);
      });
  }

  async function projectsummery(){
    await axios.get("http://localhost:8070/Dashboard/projectsummery?id="+ id+"&"+"projectname="+projectselected).then(function(response){
      setptimeline(response.data.summery)
        })
  }
   async function getprojects(){
        await axios.get("http://localhost:8070/employee/projects/"+email).then(function(response){
         
       
         if (response.data.length>0){
           setprojecttimeline(response.data.map(project=>project.name))
         }

        })
      }
  useEffect(() => {
    summery();
    getprojects();
    projectsummery();
    
  }, [projectselected]);
  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 mt-5   ms-md-5 mr-md-5">
      <h4 className="text-center bg theader"> User Activity Timeline</h4>
        <div className="scroll1 hides">
        
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col" className="text-center">Project Name</th>
                <th scope="col" className="text-center">Task name</th>
                <th scope="col" className="text-center">Start time</th>
                <th scope="col" className="text-center">End time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((numList, i) => (
                <tr key={i}>
                  {numList.map((num, j) => (
                    <td  className="text-center" key={j}>{num}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-sm-12 col-md-4 mt-5   ms-md-5 mr-md-5">
      <h4 className="text-center theader"> View Project Activity Timeline</h4>
      <select className="form-select form-select-sm dropdownbg " defaultValue={""} onChange={(e) =>
                  setproject( e.target.value)} >
                    <option disabled  value={""} > -- Select a Project -- </option>
              {projectdata.map(item => {
                return (<option  key={item} value={item}>{item}</option>);
              })}
            </select>
          
      <div className="scroll2 hides">
          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col"  className="text-center">Project Name</th>
                <th scope="col"  className="text-center">Task name</th>
                <th scope="col" className="text-center">Start time</th>
                <th scope="col" className="text-center">End time</th>
              </tr>
            </thead>
            {projectselected!=""?( <tbody>
              {pselected.map((numList, i) => (
                <tr key={i}>
                  {numList.map((num, j) => (
                    <td  className="text-center" key={j}>{num}</td>
                  ))}
                </tr>
              ))}
            </tbody>):(
              <tbody>
             
            </tbody>
            )}
           
          </table>
        </div>
      </div>
    </div>
  );
}

export default Timelines;
