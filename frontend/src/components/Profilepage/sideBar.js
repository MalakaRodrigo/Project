import React, {Component} from 'react'
import "./profile.css"
import {withRouter} from "react-router-dom";
import axios from "axios";

// **** Import this file and use it in each component ********
class Sidebar extends Component{

    state = {
        selected:"All",
        department:""
    }

    componentDidMount() {
        axios.get('http://localhost:8070/departments/')
            .then((res) => {
                console.log(res)
                const arr = res.data.filter(ele=>{
                    if(ele.Department._id==this.props.department){
                        return ele
                    }
                })
                console.log(arr[0].Department.department_name)
                this.setState({department:arr[0].Department.department_name})
            })
            .catch(err=>alert("Network Error"))
    }

    render(){
        return(
            <div className="sideBarProfileComponent">
                <div className="profile_sidebar_container">
                    <div className="profile_element"  id="profile_element_1">
                        <h5 id="profile_sidebar_title1">Department</h5>
                        <h5 className="profile_sidebar_data">{this.state.department}</h5>
                    </div>
                    <div className="profile_element"  id="profile_element_2">
                        <h5 id="profile_sidebar_title2">Designation</h5>
                        <h5 className="profile_sidebar_data">{this.props.designation}</h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Sidebar);