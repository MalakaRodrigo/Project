import React, {Component} from 'react'
import "./tasksStyle.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component{

    state = {
        selected:"All"
    }

    filterTasks = (selected) =>{
        console.log(selected)
        this.setState({
            selected:selected
        },()=>{this.props.filterTasks(selected)})
    }

    render(){

        let allStyle = this.state.selected=="All" ? "tasksAllSelected" : "tasksAll"
        let toDoStyle = this.state.selected=="To Do" ? "tasksToDoSelected" : "tasksToDo"
        let inProgressStyle = this.state.selected=="In Progress" ? "tasksInProgressSelected" : "tasksInProgress"
        let doneStyle = this.state.selected=="Done" ? "tasksDoneSelected" : "tasksDone"
        let bugsStyle = this.state.selected=="Bugs/Issues" ? "tasksBugsSelected" : "tasksBugs"
        let reviewStyle = this.state.selected=="Review" ? "tasksReviewSelected" : "tasksReview"
        let overdueStyle = this.state.selected=="Overdue" ? "tasksOverdueSelected" : "tasksOverdue"

        let allInnerStyle = this.state.selected=="All" ? "tasksAllInnerSelected" : "tasksAllInner"
        let toDoInnerStyle = this.state.selected=="To Do" ? "tasksToDoInnerSelected" : "tasksToDoInner"
        let inProgressInnerStyle = this.state.selected=="In Progress" ? "tasksInProgressInnerSelected" : "tasksInProgressInner"
        let doneInnerStyle = this.state.selected=="Done" ? "tasksDoneInnerSelected" : "tasksDoneInner"
        let bugsInnerStyle = this.state.selected=="Bugs/Issues" ? "tasksBugsInnerSelected" : "tasksBugsInner"
        let reviewInnerStyle = this.state.selected=="Review" ? "tasksReviewInnerSelected" : "tasksReviewInner"
        let overdueInnerStyle = this.state.selected=="Overdue" ? "tasksOverdueInnerSelected" : "tasksOverdueInner"

        return(
            <div className="sideBarTasksComponent">
                <h4 className="sidebarTasksHeader">Filter Status</h4>
                <div className="sideBarTasksSubContainer">
                    <div className="taskElement" id={allStyle} onClick= {() => {
                        this.filterTasks("All")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={allInnerStyle}></div></div>
                        <h6 className="taskElementText">All</h6>
                    </div>
                    <div className="taskElement" id={toDoStyle} onClick= {() => {
                        this.filterTasks("To Do")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={toDoInnerStyle}></div></div>
                        <h6 className="taskElementText">To Do</h6>
                    </div>
                    <div className="taskElement" id={inProgressStyle} onClick= {() => {
                        this.filterTasks("In Progress")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={inProgressInnerStyle}></div></div>
                        <h6 className="taskElementText">In Progress</h6>
                    </div>
                    <div className="taskElement" id={doneStyle} onClick= {() => {
                        this.filterTasks("Done")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={doneInnerStyle}></div></div>
                        <h6 className="taskElementText">Done</h6>
                    </div>
                    <div className="taskElement" id={bugsStyle} onClick= {() => {
                        this.filterTasks("Bugs/Issues")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={bugsInnerStyle}></div></div>
                        <h6 className="taskElementText">Bugs / Issues</h6>
                    </div>
                    <div className="taskElement" id={reviewStyle} onClick= {() => {
                        this.filterTasks("Review")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={reviewInnerStyle}></div></div>
                        <h6 className="taskElementText">Review</h6>
                    </div>
                    <div className="taskElement" id={overdueStyle} onClick= {() => {
                        this.filterTasks("Overdue")
                    }}>
                        <div className="tasksOutCircle"><div className="tasksInnerCircle" id={overdueInnerStyle}></div></div>
                        <h6 className="taskElementText">Overdue</h6>
                    </div>
                </div>
            </div>
        )
    }
}