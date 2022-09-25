import React, {Component} from 'react'
import "./taskBoardStyles.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="taskBoardSideBarComponent">
                {this.props.changed.changedTask==""?
                    <div>
                        <h5 className="taskBoardSideBarTitle">No Updates</h5>
                    </div>
                    :<div>
                        <h5 className="taskBoardSideBarTitle" >Updated</h5>
                        <div className="taskBoardSideBarElement" id="task">
                            <h7 className="sidebarTitle" >Task Name</h7>
                            <h7 className="sideBarText">{this.props.changed.changedTask}</h7>
                        </div>
                        <div className="taskBoardSideBarElement" id="project">
                            <h7 className="sidebarTitle">Project Name</h7>
                            <h7 className="sideBarText">{this.props.changed.projectOfChangedTask}</h7>
                        </div>
                        <div className="taskBoardSideBarElement" id="prev">
                            <h7 className="sidebarTitle">Previous Status</h7>
                            <h7 className="sideBarText">{this.props.changed.previousStatus}</h7>
                        </div>
                        <div className="taskBoardSideBarElement" id="new">
                            <h7 className="sidebarTitle">New Status</h7>
                            <h7 className="sideBarText">{this.props.changed.updatedStatus}</h7>
                        </div>
                    </div>}

            </div>
        )
    }
}