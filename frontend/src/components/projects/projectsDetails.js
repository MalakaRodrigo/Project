/*

import React, {Component} from 'react'
import Sidebar from "./sideBar";
import { withRouter } from "react-router-dom";
import "./projectsStyle.css"

class ProjectsDetails extends Component{
    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            projects: [],
            name: founduser.employee.name,
            id: founduser.employee.id,
            email: founduser.employee.email
        }
    }
      componentDidMount() {
        fetch('http://localhost:8070/employee/projects/'+ this.state.email)
          .then(response => response.json())
          .then((response) => this.setState({ 
            isLoaded: true,
            projects : response, 
               
        }));
    }
    render(){
        const {projects, isLoaded} = this.state;
        return(
            <div className="projectsMainComponent">
                <Sidebar/>
                <div className="projectsSubComponent">̵
                    

                    <table className="projectsTable">
                        <tr className="table_head">
                            <th className="table_header_column">Project Discription</th>
                            <th className="table_header_column">Members</th>
                            <th className="table_header_column">Tasks</th>
                            <th className="table_header_column">Time Logs</th>
                            <th className="table_header_column">Charts</th>
                            <th className="table_header_column">Special Notes</th>
                        </tr>
                        { (projects.length > 0) ? projects.map( (projects, index) => {
           return (
                        <tr className="table_data_odd">
                            <td className="table_data_column">{projects.discription}</td>
                            <td className="table_data_column">{[projects.members]}</td>
                            <td className="table_data_column">{projects.overdue}</td>
                            <td className="table_data_column">{projects.status}</td>
                            <td className="table_data_column"></td>
                            <td className="table_data_column">{projects.notes}</td>
                        </tr>
                     )}) : <tr><td colSpan="5">Loading...</td></tr> }
                    
                    </table>
                </div>
            </div>
        )
    }

export default withRouter(ProjectsDetails);
*/

