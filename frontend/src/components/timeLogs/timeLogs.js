import React, {Component} from 'react'
import Timelogssidebar from "./timeLogsSideBar";
import { withRouter } from "react-router-dom";
import axios from 'axios'; 
import "./timeLogs.css"

class TimeLogs extends Component{

constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            tasks: [],
            error:"",
            name: founduser.employee.name,
            id: founduser.employee.id,
            email: founduser.employee.email,
            searchTerm:""
        }
    }

    async componentDidMount() {
        
        console.log(this.state.id);
        axios.get('http://localhost:8070/dashboard/timelogs/')
            .then((res)=>{
                this.setState({
                    tasks :res.data,
                    error:"error"
                });
                

            })
            .catch(error=>{console.log(error)})
    }







    render(){
        const {tasks} = this.state;
        return(
            <div className="timeLogsMainComponent">
                 <Timelogssidebar email={this.state.email} id={this.state.id}/>
                
                <div className="timeLogsSubComponent">
               ̵
               <div className="tasks_searchBar">
                        <div className="tasks_blankColumn"></div>
                        <div className="SEARCHR">
                        <img className="tasks_searchIcon" src={require('../../assests/images/redSearch2.png').default}/>
                        <input type="text" placeholder="Search" className="tasks_taskSearchBox" onChange={event =>{
                            this.setState({
                                searchTerm:event.target.value
                            },()=>{console.log(this.state.searchTerm)})
                        }}/>
                        </div>
                    </div>

                      <div className="tableover">
                    <table className="timeLogsTable mt-3">
                        <tr className="table_head">
                            <th className="table_header_column">Name</th>
                            <th className="table_header_column">Project</th>
                            <th className="table_header_column">Task</th>
                            <th className="table_header_column">Start Time</th>
                            <th className="table_header_column">End Time</th>
                            <th className="table_header_column">Duration</th>
                            <th className="table_header_column">Memo</th>
                        </tr>
                        
                    
                            {(tasks.length > 0) ? tasks.filter((val) => {
                      if ( this.state.searchTerm == "") {
                        return val;
                      } else if (
                        val[0].toLowerCase().includes(this.state.searchTerm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[1].toLowerCase().includes(this.state.searchTerm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[2].toLowerCase().includes(this.state.searchTerm.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val[4].toLowerCase().includes(this.state.searchTerm.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                            .map((task, index) => {
                                if(index%2==0){
                                
                                    return (
                                        <tr className="tasks_table_data_odd" key={index}>
                                        {task.map((num, j) => (
                                     <td  className="tasks_table_data_column" key={j}>{num}</td>
                                     ))}
                                        </tr>

                                    )
                                }else{
                                }
                                return (
                                       <tr className="tasks_table_data_even" key={index}>
                                        {task.map((num, j) => (
                                     <td  className="tasks_table_data_column" key={j}>{num}</td>
                                     ))}
                                        </tr>

                                )
                            }) : <tr><td colSpan="5">Loading...</td></tr>
                            }
                        </table>
                        </div>
                </div>
            </div>
        )
    }
}
export default withRouter(TimeLogs);