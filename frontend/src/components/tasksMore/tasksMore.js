import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import Sidebar from "./sideBar"
import axios from "axios";

class TasksMore extends Component{
    constructor(props) {
        super(props);
        this.state = {
            task:this.props.location.state.detail,
            members:[]
        }
    }
    async componentDidMount(){
        let task_id = this.props.location.state.detail._id
        axios.post('http://localhost:8070/task/getMembers',{'task_id':task_id})
            .then((res)=>{
                // console.log("res", res.data.details)
                this.setState({
                    members :res.data.details,
                    error:"error"
                },()=>{
                    // console.log(this.state.members)
                });
            })
            .catch(error=>{console.log(error)})
    }
    render(){
        return(
            <div className="tasksMoreMainComponent">
                <Sidebar members={this.state.members}/>
                <div className="tasksMoreSubComponent">
                    <h3 className="taskTitle">{this.state.task.task_name}</h3>
                    <div className="taskDetails">
                        <h4 className="taskMoreHeader">Deatils</h4>
                        <h7 className="taskMoreDetails">{this.state.task.action}</h7>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(TasksMore);