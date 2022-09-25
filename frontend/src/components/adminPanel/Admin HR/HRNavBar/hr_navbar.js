import React, {Component} from 'react'
import "./hr_navbar_styles.css"
import { withRouter } from "react-router-dom";


class HRNavbar extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hrNav:{
                selectedDesignations: true,
                selectedEmployees: false,
                selectedLeave: false
            },
        }
    }

    componentDidMount() {
        const hrNav = localStorage.getItem("HRNav");
        const data = JSON.parse(hrNav);
        if(data!=null){
            this.setState({
                hrNav:{
                    selectedDesignations:data.selectedDesignations,
                    selectedEmployees:data.selectedEmployees,
                    selectedLeave:data.selectedLeave
                }
            },function (){
                console.log("Reloaded Nav ",this.state.hrNav)
            })
        }
    }

    changeColorDesignations(){
        this.setState({
            hrNav:{
                selectedDesignations:true,
                selectedEmployees:false,
                selectedLeave:false
            }
        },function (){
            localStorage.setItem('HRNav', JSON.stringify(this.state.hrNav))
            this.props.history.push("/HR/departments");
        })
    }
    changeColorEmployees(){
        this.setState({
            hrNav:{
                selectedDesignations:false,
                selectedEmployees:true,
                selectedLeave:false
            }
        },function (){
            localStorage.setItem('HRNav', JSON.stringify(this.state.hrNav))
            this.props.history.push("/hr/employees/menu")
        })

    }
    changeColorLeave(){
        this.setState({
            hrNav:{
                selectedDesignations:false,
                selectedEmployees:false,
                selectedLeave:true
            }
        },function (){
            localStorage.setItem('HRNav', JSON.stringify(this.state.hrNav))
            this.props.history.push("/HR/leave");
        })
    }

    render(){

        let linkClassDesignations = this.state.hrNav.selectedDesignations? "nav-link text-danger " : "nav-link text-light";
        let linkClassEmployees = this.state.hrNav.selectedEmployees ? "nav-link text-danger" : "nav-link text-light";
        let linkClassLeave = this.state.hrNav.selectedLeave ? "nav-link text-danger" : "nav-link text-light";

        return (
            <nav className="navbar navbar-expand-lg navbar-dark" id="hr_navbar">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav hr_navbar_container">
                            <li className=" nav-item active hr_navbar_element">
                                <a  className={linkClassDesignations} aria-current="page" href="#" onClick={this.changeColorDesignations.bind(this)}>Departments</a>
                            </li>
                            <li className="nav-item hr_navbar_element" >
                                <a className={linkClassEmployees} href="#" onClick={this.changeColorEmployees.bind(this)}>Employees</a>
                            </li>
                            <li className="nav-item hr_navbar_element">
                                <a className={linkClassLeave} href="#" onClick={this.changeColorLeave.bind(this)}>Leave</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

}

export default withRouter(HRNavbar);
