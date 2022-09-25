import React from "react";
import axios from "axios";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Visibility from "@material-ui/icons/Visibility";
import TrendingUp from "@material-ui/icons/TrendingUp";
import ShowProject from "../Show Projects/showProjects";
import Createtask from '../createTask/createTask'
import Createproject from '../Create Project/createProject'
import Viewtasks from '../View tasks/viewtasks'
import AnalyzeProjects from '../Project Analyze/anlyzeProjects'
import { withRouter } from "react-router-dom";
import "./adminProjects.css";



class ProjectAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsInfo: [],
      count: 0,
      localCount:parseInt(localStorage.getItem("COUNT"))
    };
  }

  componentDidMount() {
    this.adjustStats();
  }

  componentDidUpdate(){
    if(parseInt(localStorage.getItem("COUNT"))!==this.state.localCount){
      this.setState({
        localCount:parseInt(localStorage.getItem("COUNT")),
        count:0
      })
    }
  }
  adjustStats() {
    axios
      .get("http://localhost:8070/projects")
      .then((response) => {
        var projectData = [];
        projectData = response.data;
        this.setState({
          projectsInfo: projectData,
          count: 0,
          Id: this.props.id
        });
      })
      .then(() => {
        for (let i = 0; i < this.state.projectsInfo.length; i++) {
          let ID = { project_id: this.state.projectsInfo[i]._id };
          axios
            .post("http://localhost:8070/task/getTasksOfProject", ID)
            .then((response) => {
              var ProjecTStat;
              let taskData = response.data.response;

              if (
                taskData.length === 0 &&
                this.state.projectsInfo[i].projectStatus !== "Pending"
              ) {
                ProjecTStat = "Not Started";
              } else if (
                taskData.length === 0 &&
                this.state.projectsInfo[i].projectStatus === "Pending"
              ) {
                ProjecTStat = "Pending";
              } else {
                for (let y = 0; y < taskData.length; y++) {
                  if (
                    taskData[y].task_status === "To Do" ||
                    taskData[y].task_status === "In Progress" ||
                    taskData[y].task_status === "Bugs/Issues"
                  ) {
                    ProjecTStat = "On going";
                    break;
                  } else if (
                    taskData[y].task_status === "Review" ||
                    taskData[y].task_status === "Done"
                  ) {
                    ProjecTStat = "Completed";
                  }
                }
              }
              let sendData = { projectStatus: ProjecTStat };
              axios
                .post(
                  "http://localhost:8070/projectsstatus/" +
                  this.state.projectsInfo[i]._id,
                  sendData
                )
                .then((response) => {
                  console.log('Status Updated');
                });
            });
        }
      });
  }


  gotoCreateproject = (event) => {
    this.setState({
      count: 1,
    })
  }
  gotoCreatetask = (event) => {
    this.setState({
      count: 2,
    })
  }

  gotoviewtask = (event) => {
    this.setState({
      count: 3,
    })
  }
  gotoanalyze = (event) => {

    this.setState({
      count: 4
    })
  }

  gotohome = (event) => {

    this.setState({
      count: 0
    })
  }




  render() {
    const { count } = this.state;

    return (
      <div>
        <div class="float-parent-element">
          <div class="float-child-element1">
            {count === 0 ? <div class="maincomponentProject"><ShowProject /></div> : null}
            {count === 1 ? <div class="maincomponentProject"><Createproject /></div> : null}
            {count === 2 ? <div class="maincomponentProject"><Createtask /></div> : null}
            {count === 3 ? <div class="maincomponentProject">< Viewtasks /></div> : null}
            {count === 4 ? <div class="maincomponentProject">< AnalyzeProjects /></div> : null}

          </div>
          <div class="float-child-element2">
            <div class="sidebarProject">
            <div>
                <button class="buttonproject b1" style={{ marginTop: '5px'}} onClick={this.gotohome}><Visibility
                  fontSize="large"
                  htmlColor="#ff0000"
                />&nbsp;View and Edit Projects<br /><p class="p">view a summary project details</p></button>
              </div>
              <div>
                <button class="buttonproject b2" style={{ marginTop: '20px' }} onClick={this.gotoCreateproject}><AddCircleOutlineOutlinedIcon
                  fontSize="large"
                  htmlColor="#ff0000"
                />&nbsp;Create Project<br /><p class="p">add new task to existing projects</p></button>
              </div>
              <div>
                <button class="buttonproject b3" style={{ marginTop: '20px' }} onClick={this.gotoCreatetask}><AddCircleOutlineOutlinedIcon
                  fontSize="large"
                  htmlColor="#ff0000"
                />&nbsp;Add New Task<br /><p class="p">create your new project at glance</p></button>
              </div>
              <div>
                <button class="buttonproject b4" style={{ marginTop: '20px' }} onClick={this.gotoviewtask}><Visibility
                  fontSize="large"
                  htmlColor="#ff0000"
                />&nbsp;View and Edit Tasks<br /><p class="p">view a summary of all tasks</p></button>
              </div>
              <div>
                <button class="buttonproject b5" style={{ marginTop: '20px' , marginBottom: '0px'  }} onClick={this.gotoanalyze}><TrendingUp
                  fontSize="large"
                  htmlColor="#ff0000"
                />&nbsp;Status<br /><p class="p">Evaluare your work</p></button>
              </div>




            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ProjectAdmin);
