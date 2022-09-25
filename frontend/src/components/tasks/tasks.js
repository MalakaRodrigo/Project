import React, {Component} from 'react'
import "./tasksStyle.css"
import Sidebar from "./sideBar";
import { withRouter } from "react-router-dom";
import axios from 'axios';


class Tasks extends Component{

    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            tasks: [],
            tasks2:[], // Coppy of all the tasks
            error:"",
            name: founduser.employee.name,
            id: founduser.employee.id,
            email: founduser.employee.email,
            searchTerm:""
        }
    }

    filterTasks = (selectedType) => {
        this.setState({
            tasks:this.state.tasks2
        }, () => {
            let tempTasks = []
            if(selectedType=="All"){
                this.state.tasks.filter((value)=>{
                    tempTasks.push(value)
                })
                console.log(tempTasks)
            }else{
                if(this.state.tasks.length > 0){
                    this.state.tasks.filter((value)=>{
                        if(value.task_status==selectedType){
                            tempTasks.push(value)
                        }
                    })
                }
                console.log(tempTasks)
            }
            this.setState({
                tasks : tempTasks
            })
        })
    }

    async componentDidMount() {
        // POST request using fetch with async/await
        axios.post('http://localhost:8070/task/getTaskByAssignedTo/',{'assigned_to':this.state.id})
            .then((res)=>{
                this.setState({
                    tasks :res.data.response,
                    error:"error",
                },()=>{
                    this.setState({
                        tasks2 : this.state.tasks
                    })
                });

            })
            .catch(error=>{console.log(error)})
    }

    clickMore = (task) => {
        this.props.history.push({
            pathname:"/tasksMore",
            search: '?query=abc',
            state: { detail: task}
        })
    }

    goTaskBoard = () => {
        this.props.history.push("/tasksBoard");
    }
    render(){
        const {tasks} = this.state;
        return(
            <div className="tasksMainComponent">
                <Sidebar filterTasks={this.filterTasks}/>
                <div className="tasksSubComponent">̵
                    <div className="tasks_searchBar">
                        <div className="tasks_blankColumn"></div>
                        <div className="SEARCHR">
                        <img className="tasks_searchIcon" src={require('../../assests/images/redSearch2.png').default}/>
                        <input type="text" placeholder="Search by Project or Task" className="tasks_taskSearchBox" onChange={event =>{
                            this.setState({
                                searchTerm:event.target.value
                            },()=>{console.log(this.state.searchTerm)})
                        }}/>
                    </div>
                    </div>

                    <div className="tasksScroll hides">
                        <table className="tasksTable">
                            <tr className="tasks_table_head">
                                <th className="tasks_table_header_column">Task</th>
                                <th className="tasks_table_header_column">Project</th>
                                <th className="tasks_table_header_column">Due Date</th>
                                <th className="tasks_table_header_column">Status</th>
                                <th className="tasks_table_header_column_more">More</th>
                            </tr>

                            {(tasks.length > 0) ? tasks.filter((val)=>{
                                if(this.state.searchTerm==""){
                                    return val;
                                }else if(val.project_name.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
                                    return val;
                                }else if(val.task_name.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
                                    return val;
                                }
                            }).map((task, index) => {
                                if(index%2==0){
                                    let status ="";
                                    if(task.task_status=="toDo"){status="To do"}
                                    else if(task.task_status=="inProgress"){status="In Progress"}
                                    else if(task.task_status=="done"){status="Done"}
                                    else if(task.task_status=="bugs"){status="Bugs / Issues"}
                                    else if(task.task_status=="toDo"){status="Review"}
                                    return (
                                        <tr className="tasks_table_data_odd" key={index}>

                                            <td className="tasks_table_data_column">{task.task_name}</td>
                                            <td className="tasks_table_data_column">{task.project_name}</td>
                                            <td className="tasks_table_data_column">{task.due_date.substring(0,10)}</td>
                                            <td className="tasks_table_data_column">{task.task_status}</td>
                                            <td className="tasks_table_data_column_more">
                                                <div
                                                    className="moreButton"
                                                    onClick ={()=>this.clickMore(task)}
                                                >
                                                    More
                                                </div>
                                            </td>
                                        </tr>

                                    )
                                }else{
                                }
                                return (
                                    <tr className="tasks_table_data_even" key={index}>

                                        <td className="tasks_table_data_column">{task.task_name}</td>
                                        <td className="tasks_table_data_column">{task.project_name}</td>
                                        <td className="tasks_table_data_column">{task.due_date.substring(0,10)}</td>
                                        <td className="tasks_table_data_column">{task.task_status}</td>
                                        <td className="tasks_table_data_column_more">
                                            <div
                                                className="tasks_moreButton"
                                                onClick ={()=>this.clickMore(task)}
                                            >
                                                More
                                            </div>
                                        </td>
                                    </tr>

                                )
                            }) : <tr><td colSpan="5">Loading...</td></tr>
                            }
                        </table>
                    </div>
                    
                    <div className="tasks_goToTaskBoardButton" onClick={this.goTaskBoard}>
                        <h6 className="tasks_taskBoardText">TASK BOARD</h6>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Tasks);