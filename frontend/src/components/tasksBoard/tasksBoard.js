import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import "./taskBoardStyles.css"
import Sidebar from "./sideBar";
import {red} from "@material-ui/core/colors";
import axios from "axios";
class TasksBoard extends Component{

    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            tasks2:[],
            error:"",
            changed :{
                changedTask:"",
                projectOfChangedTask:"",
                previousStatus:"",
                updatedStatus:""
            },
            name: founduser.employee.name,
            id: founduser.employee.id,
            email: founduser.employee.email
        }
    }

    async componentDidMount() {
        const updatedStatus = localStorage.getItem("TaskBoardUpdatedStatus");
        const data = JSON.parse(updatedStatus);
        // POST request using fetch with async/await
        axios.post('http://localhost:8070/task/getTaskByAssignedTo/',{'assigned_to':this.state.id})
            .then((res)=>{
                this.setState({
                    tasks2 :res.data.response,
                    error:"error"
                });

            })
            .catch(error=>{console.log(error)})
        if(data!=null){
            this.setState({
                changed :{
                    changedTask:data.changedTask,
                    projectOfChangedTask:data.projectOfChangedTask,
                    previousStatus:data.previousStatus,
                    updatedStatus:data.updatedStatus
                },
            })
        }
    }

    onDragStart = (ev, id,prevStatus) => {
        ev.dataTransfer.setData("id", id);
        ev.dataTransfer.setData("prev", prevStatus);
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    async onDrop(ev, stat){
        let id = ev.dataTransfer.getData("id");
        let prevStatus =  ev.dataTransfer.getData("prev");
        let tasks = this.state.tasks2.filter((task) => {
            if (task._id == id) {
                task.task_status = stat;
                console.log(task)
                axios.post('http://localhost:8070/task/updateStatus',{'task_status':stat,'task_id':task._id})
                    .then((res)=>{
                         console.log(res)
                        this.setState({
                            changed:{
                                changedTask:task.task_name,
                                projectOfChangedTask:task.project_name,
                                previousStatus:prevStatus,
                                updatedStatus:stat
                            }
                        })
                        localStorage.setItem('TaskBoardUpdatedStatus', JSON.stringify(this.state.changed))
                    })
                    .catch(error=>{console.log(error)})
            }
            return task;
        });

        this.setState({
            ...this.state,
            tasks
        });
    }

    render(){
        var tasks = {
            toDo:[],
            inProgress:[],
            done:[],
            bugs:[],
            review:[]
        }

        this.state.tasks2.forEach ((t) => {
            if(t.task_status=="To Do"){
                tasks["toDo"].push(
                    <div key={t._id}
                         onDragStart = {(e) => this.onDragStart(e, t._id,t.task_status)}
                         draggable
                         className="toDo"
                    >
                        <div>
                            <h5 className="taskHeader">{t.task_name}</h5>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Project Name</h6>
                            <h7>{t.project_name}</h7>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Due Date</h6>
                            <h7>{t.due_date}</h7>
                        </div>
                    </div>
                );
            }else if(t.task_status=="In Progress"){
                tasks["inProgress"].push(
                    <div key={t._id}
                         onDragStart = {(e) => this.onDragStart(e, t._id,t.task_status)}
                         draggable
                         className="inProgress"
                    >
                        <div>
                            <h5 className="taskHeader">{t.task_name}</h5>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Project Name</h6>
                            <h7>{t.project_name}</h7>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Due Date</h6>
                            <h7>{t.due_date}</h7>
                        </div>
                    </div>
                );

            }else if(t.task_status=="Done"){
                tasks["done"].push(
                    <div key={t._id}
                         onDragStart = {(e) => this.onDragStart(e, t._id,t.task_status)}
                         draggable
                         className="done"
                    >
                        <div>
                            <h5 className="taskHeader">{t.task_name}</h5>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Project Name</h6>
                            <h7>{t.project_name}</h7>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Due Date</h6>
                            <h7>{t.due_date}</h7>
                        </div>
                    </div>
                );
            }else if(t.task_status=="Bugs/Issues"){
                tasks["bugs"].push(
                    <div key={t._id}
                         onDragStart = {(e) => this.onDragStart(e, t._id,t.task_status)}
                         draggable
                         className="bugs"
                    >
                        <div>
                            <h5 className="taskHeader">{t.task_name}</h5>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Project Name</h6>
                            <h7>{t.project_name}</h7>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Due Date</h6>
                            <h7>{t.due_date}</h7>
                        </div>
                    </div>
                );
            }else if(t.task_status=="Review"){
                tasks["review"].push(
                    <div key={t._id}
                         onDragStart = {(e) => this.onDragStart(e, t._id,t.task_status)}
                         draggable
                         className="review"
                    >
                        <div>
                            <h5 className="taskHeader">{t.task_name}</h5>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Project Name</h6>
                            <h7>{t.project_name}</h7>
                        </div>
                        <div className="statusBarElement">
                            <h6 className="taskDetailHeader">Due Date</h6>
                            <h7>{t.due_date}</h7>
                        </div>
                    </div>
                );
            }

        });

        return(
            <div className="tasksBoardComponent">
                <Sidebar changed={this.state.changed}/>
                <div className="header">
                    <h4>Tasks Board</h4>
                    <h7 className="normalText">Drag and Drop to Change the Status</h7>
                </div>
                <div className="tasksBoardSubComponent">
                    <div className="statusBarContainer">
                        <div
                            className="statusBar"
                            id="toDo"
                            onDragOver={(e)=>this.onDragOver(e)}
                            onDrop={(e)=>{this.onDrop(e, "To Do")}}
                        >
                            <h5 className="statusBarTitle">To do</h5>
                            {tasks.toDo}
                        </div>
                        <div
                            className="statusBar"
                            id="inProgress"
                            onDragOver={(e)=>this.onDragOver(e)}
                            onDrop={(e)=>{this.onDrop(e, "In Progress")}}>
                            <h5 className="statusBarTitle">In Progress</h5>
                            {tasks.inProgress}
                        </div>
                        <div
                            className="statusBar"
                            id="done"
                            onDragOver={(e)=>this.onDragOver(e)}
                            onDrop={(e)=>{this.onDrop(e, "Done")}}
                        >
                            <h5 className="statusBarTitle">Done</h5>
                            {tasks.done}
                        </div>
                        <div
                            className="statusBar"
                            id="bugs"
                            onDragOver={(e)=>this.onDragOver(e)}
                            onDrop={(e)=>{this.onDrop(e, "Bugs/Issues")}}
                        >
                            <h5 className="statusBarTitle">Bugs / Issues</h5>
                            {tasks.bugs}
                        </div>
                        <div
                            className="statusBar"
                            id="review"
                            onDragOver={(e)=>this.onDragOver(e)}
                            onDrop={(e)=>{this.onDrop(e, "Review")}}
                        >
                            <h5 className="statusBarTitle">Review</h5>
                            {tasks.review}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TasksBoard);