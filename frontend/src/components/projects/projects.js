import React, { Component } from 'react'
import "./projectsStyle.css"
import Sidebar from "./sideBar";
import { withRouter } from "react-router-dom";



class Projects extends Component {
    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            projects: [],
            name: founduser.employee.name,
            id: founduser.employee.id,
            email: founduser.employee.email,
            searchTerm:""
        }
    }
    componentDidMount() {
        fetch('http://localhost:8070/employee/projects/' + this.state.email)
            .then(response => response.json())
            .then((response) => this.setState({
                isLoaded: true,
                projects: response,

            }));
        //added by Malaka, will change your project page title - delete after read :)
        document.title = "PROJECT"
    }

    clickMore = () => {
        this.props.history.push("/projectsDetails");
    }
    render() {

        const { projects } = this.state;
console.log(this.state.projects);
        return (

            <div className="projectsMainComponent">
                <Sidebar />
                <div className="projectsSubComponent">̵
                <div className="tasks_searchBar">
                        <div className="tasks_blankColumn"></div>
                        <div className="SEARCHR">
                        <img className="tasks_searchIcon" src={require('../../assests/images/redSearch2.png').default}/>
                        <input type="text" placeholder="Search by Project" className="tasks_taskSearchBox" onChange={event =>{
                            this.setState({
                                searchTerm:event.target.value
                            },()=>{console.log(this.state.searchTerm)})
                        }}/>
                        </div>
                    </div>

                    <table className="projectsTable">
                        <tr className="table_head">

                            <th className="table_header_column">Project Name</th>
                            <th className="table_header_column">Project Discription</th>
                            <th className="table_header_column">Members</th>
                            <th className="table_header_column">Due Date</th>
                            <th className="table_header_column">Status</th>
                            <th className="table_header_column">Special Notes</th>
                        </tr>

                        {(projects.length > 0) ? projects.filter((val)=>{
                                if(this.state.searchTerm==""){
                                    return val;
                                }else if(val.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
                                    return val;
                                }
                            }).map((projects, index) => {
                                if(index%2==0){
                                    return (
                                        <tr className="table_data_odd" key={index}>
        
                                            <td className="table_data_column">{projects.name}</td>
                                            <td className="table_data_column">{projects.discription}</td>
                                            <td className="table_data_column">{[projects.members.map((member,index2)=>{
                                                return(<li>
                                                    {member}
                                                </li>)
                                            })]}</td>
                                            <td className="table_data_column">{projects.overdue.substring(0,10)}</td>
                                            <td className="table_data_column">{projects.projectStatus}</td>
                                            <td className="table_data_column">{projects.notes}</td>
                                        </tr>
        
                                    )
                                }else{
                                    return (
                                        <tr className="table_data_even" key={index}>
        
                                            <td className="table_data_column">{projects.name}</td>
                                            <td className="table_data_column">{projects.discription}</td>
                                            <td className="table_data_column">{[projects.members.map((member,index2)=>{
                                                return(<li>
                                                    {member}
                                                </li>)
                                            })]}</td>
                                           <td className="table_data_column">{projects.overdue.substring(0,10)}</td>
                                            <td className="table_data_column">{projects.projectStatus}</td>
                                            <td className="table_data_column">{projects.notes}</td>
                                        </tr>
        
                                    )
                                }
                            
                        }) : <tr><td colSpan="5">Loading...</td></tr>}
                    

                    </table>
                </div>
            </div>
        )
    }
}

export default withRouter(Projects);