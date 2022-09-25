import React, {Component} from 'react'
import "./projectsStyle.css"
import "./sidebarProjectsStyles.css"


// **** Import this file and use it in each component ********
export default class Sidebar extends Component{
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

    componentDidMount(){

        fetch('http://localhost:8070/employee/countProjects/' + this.state.email)
            .then(response => response.json())
            .then((response) => this.setState({
                isLoaded: true,
                projects: response,
            }));
    }


    render(){
        const { projects } = this.state;

        return(
            <div className="dashboardsidemainComponent title">
            <div className="ps-3 pe-3  mt-3">
            <div className="ctbuttonP col-12 " >
              Pending Projects
              <div className="siderbarfontP">{projects.pending}</div>             
          </div>
          </div>
          <div className="ps-3 pe-3  mt-3">
            <div className="ptbuttonP col-12 ">
              Not-started 
              <div className="siderbarfontP">{projects.not_started}</div>
              </div>
          </div>
          <div className="ps-3 pe-3  mt-3">
            <div className="ctbuttonP1 col-12 ">
              Ongoing Projects
              <div className="siderbarfontP">{projects.ongoing}</div>
              </div>             
          </div>
          <div className="ps-3 pe-3  mt-3">
            <div className="cpbuttonP col-12 " >
              Completed Projects
              <div className="siderbarfontP">{projects.completed}</div>             
          </div>
          </div><div className="ps-3 pe-3  mt-3">
            <div className="ctbuttonP2 col-12 " >
            Projects Over due
              <div className="siderbarfontP">{projects.over_due}</div>             
          </div>
          </div>

        </div>
        )
    }
}