import React, {Component} from 'react'
import "./adminNavbar.css"
import { withRouter } from "react-router-dom";

class AdminNavbar extends Component{
    constructor(props) {
        super(props);
        const loggedInUser = localStorage.getItem("user");
        const founduser = JSON.parse(loggedInUser);
        this.state = {
            nav:{
                selectedHome: true,
                //selectedReports:false,
                selectedProjects:false,
                selectedHR:false,
                selectedClients:false,
                selectedEmployees:false,
            },
            name: founduser.employee.name,
            openProfileMenu:"employee_menu",
            id:founduser.employee.id,
            profileImage:"http://localhost:8070/"+founduser.employee.profileImage,
            COUNT:0
        }
    }

    componentDidMount() {
        const nav = localStorage.getItem("Nav");
        console.log("NAV",nav)
        const data = JSON.parse(nav);
        if(data!=null){
            this.setState({
                nav:{
                    selectedHome: data.selectedHome,
                    //selectedReports:false,
                    selectedProjects:data.selectedProjects,
                    selectedHR:data.selectedHR,
                    selectedClients:data.selectedClients,
                    selectedEmployees:data.selectedEmployees,
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
                //selectedReports:false,
                selectedProjects:false,
                selectedHR:false,
                selectedClients:false,
                selectedEmployees:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/adminPanel");
        })
    }
    /*changeColorReports(){
        this.setState({
            selectedHome:false,
            selectedReports:true,
            selectedProjects:false,
            selectedHR:false,
            selectedClients:false,
            selectedEmployees:false,
            selectedLogout:false
        })
        this.props.history.push("/reports")
    }*/
    changeColorProjects(){
        localStorage.setItem("COUNT", this.state.COUNT);
        this.setState({
            
            nav:{
                selectedHome:false,
                //selectedReports:false,
                selectedProjects:true,
                selectedHR:false,
                selectedClients:false,
                selectedEmployees:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/projects")
        })
        this.setState({COUNT:this.state.COUNT+1})
    }
    changeColorHR(){
        this.setState({
            nav:{
                selectedHome:false,
                //selectedReports:false,
                selectedProjects:false,
                selectedHR:true,
                selectedClients:false,
                selectedEmployees:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/hr/departments");
        })
    }
    changeColorClients(){
        this.setState({
            nav:{
                selectedHome:false,
                //selectedReports:false,
                selectedProjects:false,
                selectedHR:false,
                selectedClients:true,
                selectedEmployees:false,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/clients");
        })
    }

    changeColorEmployees(){
        this.setState({
            nav:{
                selectedHome:false,
                //selectedReports:false,
                selectedProjects:false,
                selectedHR:false,
                selectedClients:false,
                selectedEmployees:true,
                selectedLogout:false
            }
        },function (){
            localStorage.setItem('Nav', JSON.stringify(this.state.nav))
            this.props.history.push("/employees/addEmployee");
        })

    }
    render(){

        let linkClassHome = this.state.nav.selectedHome ? "nav-link text-danger " : "nav-link text-light";
      //  let linkClassReports = this.state.selectedReports ? "nav-link text-danger" : "nav-link text-light";
        let linkClassProjects = this.state.nav.selectedProjects ? "nav-link text-danger" : "nav-link text-light";
        let linkClassHR = this.state.nav.selectedHR? "nav-link text-danger" : "nav-link text-light";
        let linkClassClients = this.state.nav.selectedClients ? "nav-link text-danger" : "nav-link text-light";
        let linkClassEmployees = this.state.nav.selectedEmployees ? "nav-link text-danger" : "nav-link text-light";
        let linkClassLogout = this.state.nav.selectedLogout ? "nav-link text-danger" : "nav-link text-light";
        return (
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="logoContainer">
                <img  className = "logo" src={require('../../../assests/images/logo.png').default}/>
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
                            <a  className={linkClassHome} aria-current="page" href="#" onClick={this.changeColorHome.bind(this)}>Dashboard</a>
                            </li>
                            {/*<li className="nav-item" >
                                <a className={linkClassReports } href="#" onClick={this.changeColorReports.bind(this)}>Reports</a>
        </li>*/}
                            <li className="nav-item"> 
                                <a className={linkClassProjects} href="#" onClick={this.changeColorProjects.bind(this)}>Projects</a>
                            </li>
                            <li className="nav-item">
                                <a className={linkClassHR} href="#" onClick={this.changeColorHR.bind(this)}>Departments</a>
                            </li>
                            <li className="nav-item">
                                <a className={linkClassClients} href="#" onClick={this.changeColorClients.bind(this)}>Clients</a>
                            </li>
                            <li className="nav-item">
                                <a  className={linkClassEmployees} href="#" onClick={this.changeColorEmployees.bind(this)
                            }>Employees</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="employee_navbar_action"  style={{zIndex:10}}>
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
                            {/* <li className="hiddenMenuListItem">
                                <img className="hiddenMenuIcon" src={require('../../../assests/images/notifications.png').default}/>
                                <h7 className="hiddenMenuListItemText">Notofications</h7>
                            </li> */}
                            <li className="hiddenMenuListItem">
                                <img className="hiddenMenuIcon" src={require('../../../assests/images/logout.png').default}/>
                                <h7 className="hiddenMenuListItemText" onClick={this.logOut.bind(this)}>Logout</h7>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>
        )
    }

}

export default withRouter(AdminNavbar);