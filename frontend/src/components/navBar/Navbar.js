import React, {Component} from 'react'
import "./navBarStyle.css"
import { withRouter } from "react-router-dom";
import Notification from '../../assests/images/notifications.png'

class Navbar extends Component{
    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        console.log("Logged User ",founduser)
        this.state = {
            nav:{
                selectedHome: true,
                selectedProjects: false,
                selectedTasks: false,
                selectedCalendar: false,
                selectedTimeLogs: false
            },
            openProfileMenu:"employee_menu",
            name: founduser.employee.name,
            id:founduser.employee.id,
            profileImage:"http://localhost:8070/"+founduser.employee.profileImage

        }
    }

    componentDidMount() {
        const nav = localStorage.getItem("Nav");
        const data = JSON.parse(nav);
        if(data!=null){
            this.setState({
                nav:{
                    selectedHome:data.selectedHome,
                    selectedProjects:data.selectedProjects,
                    selectedTasks:data.selectedTasks,
                    selectedCalendar:data.selectedCalendar,
                    selectedTimeLogs:data.selectedTimeLogs,
                    selectedLogout:data.selectedLogout
                }
            },function (){
                console.log("Reloaded Nav ",this.state.nav)
            })
        }
    }

    openProfileMenu(){
        if(this.state.openProfileMenu=="employee_menu"){
            console.log("open menu",this.state.openProfileMenu)
            this.setState({
                openProfileMenu:"opened_employee_menu"
            })
        }else{
            console.log("Close menu",this.state.openProfileMenu)
            this.setState({
                openProfileMenu:"employee_menu"
            })
        }

    }
    logOut(){
        this.props.history.push("/");
        this.props.logout();
    }
    changeColorHome(){
        this.setState({
            nav:{
                selectedHome:true,
                selectedProjects:false,
                selectedTasks:false,
                selectedCalendar:false,
                selectedTimeLogs:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/Dashboard");
        })
    }
    changeColorProjects(){
        this.setState({
            nav:{
                selectedHome:false,
                selectedProjects:true,
                selectedTasks:false,
                selectedCalendar:false,
                selectedTimeLogs:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/projects")
        })

    }
    changeColorTasks(){
        this.setState({
            nav:{
                selectedHome:false,
                selectedProjects:false,
                selectedTasks:true,
                selectedCalendar:false,
                selectedTimeLogs:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/tasks");
        })
    }
    changeColorCalendar(){
        this.setState({
            nav:{
                selectedHome:false,
                selectedProjects:false,
                selectedTasks:false,
                selectedCalendar:true,
                selectedTimeLogs:false,
                selectedLogout:false
            }
        },function(){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/api/taskBackLog");
        })
    }
    changeColorTimeLogs(){
        this.setState({
            nav:{
                selectedHome:false,
                selectedProjects:false,
                selectedTasks:false,
                selectedCalendar:false,
                selectedTimeLogs:true,
                selectedLogout:false
            }
        },function(){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/timeLogs");
        })
    }

    displayNotification = ({ senderName, type }) => {
        let action;
        return (
          <span className="notification">Notification</span>
        );
      };

    render(){

        let linkClassHome = this.state.nav.selectedHome ? "nav-link text-danger " : "nav-link text-light";
        let linkClassProjects = this.state.nav.selectedProjects ? "nav-link text-danger" : "nav-link text-light";
        let linkClassTasks = this.state.nav.selectedTasks ? "nav-link text-danger" : "nav-link text-light";
        let linkClassCalendar = this.state.nav.selectedCalendar? "nav-link text-danger" : "nav-link text-light";
        let linkClassTimeLogs = this.state.nav.selectedTimeLogs ? "nav-link text-danger" : "nav-link text-light";
        let linkClassLogout = this.state.nav.selectedLogout ? "nav-link text-danger" : "nav-link text-light";
        return (
            <nav className="navbar navbar-expand-lg navbar-dark" id="employeeNavbar">
                <div className="logoContainer">
                <img  className = "logo" src={require('../../assests/images/logo.png').default}/>
                </div>

                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className=" nav-item active">
                                <a  className={linkClassHome} aria-current="page" href="#" onClick={this.changeColorHome.bind(this)}>Home</a>
                            </li>
                            <li className="nav-item" >
                                <a className={linkClassProjects} href="#" onClick={this.changeColorProjects.bind(this)}>Projects</a>
                            </li>
                            <li className="nav-item">
                                <a className={linkClassTasks} href="#" onClick={this.changeColorTasks.bind(this)}>Tasks</a>
                            </li>
                            <li className="nav-item">
                                <a className={linkClassCalendar} href="#" onClick={this.changeColorCalendar.bind(this)}>Calendar</a>
                            </li>
                            <li className="nav-item">
                                <a className={linkClassTimeLogs} href="#" onClick={this.changeColorTimeLogs.bind(this)}>Time Logs</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="employee_navbar_action"  style={{zIndex:10}}>
                    <div>
                    <div className = "icons" onClick={this.displayNotification.bind(this)}>
                                <img className="notificationE" src={Notification}/>
                                <div className = "notificationCounter">
                            2
                        </div>
                    </div>
                    </div>
                    <div className="employee_profile" onClick={this.openProfileMenu.bind(this)}>
                        <img className="employee_avatar" src={this.state.profileImage}/>
                    </div>
                    <div className={this.state.openProfileMenu}>
                        <h4 className="hiddenMenuTitle">
                            Welcome
                            <br/>
                            <span className="hiddenMenuSpan">{this.state.name}</span>
                        </h4>
                        <ul>
                            <li className="hiddenMenuListItem">
                            <img className="hiddenMenuIcon" src={require('../../assests/images/settings.png').default}/>
                                <a href="http://localhost:3000/Profile">
                                <h7 className="hiddenMenuListItemText">Profile</h7>
                                </a>
                            </li>
                            <li className="hiddenMenuListItem">
                                <img className="hiddenMenuIcon" src={require('../../assests/images/logout.png').default}/>
                                <h7 className="hiddenMenuListItemText" onClick={this.logOut.bind(this)}>Logout</h7>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

}

export default withRouter(Navbar);
