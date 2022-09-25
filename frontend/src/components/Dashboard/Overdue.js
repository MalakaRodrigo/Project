import React, { useState, useEffect } from "react";
import "./Timelines.css";
const axios = require("axios").default;

function Overdue({ id }) {
  const [overdue, setoverdue] = useState([]);
  const[check,setcheck]=useState(false)
  async function overduetasks() {
     await axios
      .get("http://localhost:8070/dashboard/getoverduetasks/" + id)
      .then(function (response) {
        setcheck(true);
        if (response.data.length > 0) {
          setoverdue(response.data);
         
        }
      });
  }
  useEffect(() => {
    overduetasks();
  }, []);
  return (
    <div className="col-sm-12 col-md-12 ">
      {overdue.length !== 0 && check ? (
        <div>
          <h4 className="overdueheader text-center">Overdue Tasks</h4>
          <div className="scrolloverdue hides ">
            <table className="table table-dark table-striped">
              
                <tbody>
                  {overdue.map((numList, i) => (
                    <tr className="overduebackgroud overduefc" key={i}>
                      {numList.map((num, j) => (
                        <td key={j}>{num}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        check?(<div>
          <h1 className="overdueheader text-center nooverdue">Keep It Up
          <br/>
        <img className="nooverdueimg  " src={require('../../assests/images/completed.png').default}/></h1>
          <h2 className="text-center nooverdue">No Overdue Tasks</h2>
          
        </div>):(<div></div>)
        
      )}
    </div>
  );
}

export default Overdue;
