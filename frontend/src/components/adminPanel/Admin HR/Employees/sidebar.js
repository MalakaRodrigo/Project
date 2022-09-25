import React, {Component} from 'react'
import "./employees_style.css"
import {withRouter} from "react-router-dom";

// **** Import this file and use it in each component ********
class Sidebar extends Component{
    constructor(props) {
        super(props);

        this.state={
            selected:"All",
            addElementStyle : "employees_sidebar_employee0",
            deleteElementStyle : "employees_sidebar_employee3",
            updatePasswordStyle : "employees_sidebar_employee1",
            updatePositionStyle : "employees_sidebar_employee2"
        }
    }

    componentDidMount() {
        this.setState({
            selected:this.props.elementStyle
        })
    }

    changeMenu = (menu) => {
        if(menu=="All"){
            this.setState({
                selected:menu
            })
            this.props.history.push("/employees/addEmployee")
        }else if(menu=="To Do"){
            this.setState({
                selected:menu
            })
            this.props.history.push("/employees/updatePassword")
        }else if(menu=="In Progress"){
            this.setState({
                selected:menu
            })
            this.props.history.push("/employees/updatePosition")
        }else if(menu=="Done"){
            this.setState({
                selected:menu
            })
            this.props.history.push("/employees/deleteEmployee")
        }
    }

    render(){
        let allStyle = this.state.selected=="All" ? "tasksAllSelected" : "tasksAll"
        let toDoStyle = this.state.selected=="To Do" ? "tasksToDoSelected" : "tasksToDo"
        let inProgressStyle = this.state.selected=="In Progress" ? "tasksInProgressSelected" : "tasksInProgress"
        let doneStyle = this.state.selected=="Done" ? "tasksDoneSelected" : "tasksDone"

        let allInnerStyle = this.state.selected=="All" ? "tasksAllInnerSelected" : "tasksAllInner"
        let toDoInnerStyle = this.state.selected=="To Do" ? "tasksToDoInnerSelected" : "tasksToDoInner"
        let inProgressInnerStyle = this.state.selected=="In Progress" ? "tasksInProgressInnerSelected" : "tasksInProgressInner"
        let doneInnerStyle = this.state.selected=="Done" ? "tasksDoneInnerSelected" : "tasksDoneInner"

        return(
            <div className="sideBarTasksComponent">
                <div className="sideBarEmployeesSubContainer">
                    <div className="employeesElement" id={allStyle} onClick= {() => {
                        this.changeMenu("All")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={allInnerStyle}></div></div>
                        <h6 className="taskElementText">Add Employee</h6>
                    </div>
                    <div className="employeesElement" id={toDoStyle} onClick= {() => {
                        this.changeMenu("To Do")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={toDoInnerStyle}></div></div>
                        <h6 className="taskElementText">Update Password</h6>
                    </div>
                    <div className="employeesElement" id={inProgressStyle} onClick= {() => {
                        this.changeMenu("In Progress")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={inProgressInnerStyle}></div></div>
                        <h6 className="taskElementText">Update Position</h6>
                    </div>
                    <div className="employeesElement" id={doneStyle} onClick= {() => {
                        this.changeMenu("Done")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={doneInnerStyle}></div></div>
                        <h6 className="taskElementText">Delete Account</h6>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Sidebar);