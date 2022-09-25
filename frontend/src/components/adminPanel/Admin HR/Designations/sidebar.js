import React, {Component} from 'react'
import "./designations_style.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sideBarDesignationsComponent">
                <h4 className="designationsSideBarTitle">{this.props.sideBarTitle}</h4>
                <div className="designations_sidebar_employees_container">
                    {this.props.employees.length > 0 ?
                        this.props.employees.map((employee,index)=> {
                            let employee_style = ""
                            if(index%4==0){
                                employee_style = "designations_sidebar_employee0"
                            }else if(index%4==1){
                                employee_style = "designations_sidebar_employee1"
                            }else if(index%4==2){
                                employee_style = "designations_sidebar_employee2"
                            }else if(index%4==3){
                                employee_style = "designations_sidebar_employee3"
                            }
                            return(
                                <div className="designations_sidebar_employee"  id={employee_style} key={index}>
                                    <div className="designations_sidebar_employee_image">
                                        {
                                            employee.profileImage != "" ?
                                            <img className="designations_employee_avatar"
                                                 src={"http://localhost:8070/" + employee.profileImage} alt="No image"/>
                                            : <div></div>
                                        }
                                    </div>
                                    <h5 className="designations_sidebar_employee_name">{employee.name}</h5>
                                    <h5 className="designations_sidebar_employee_name" id="designations_sidebar_employee_email">{employee.email}</h5>
                                </div>
                            )
                        })
                        :
                        <div className="designations_sidebar_error">
                            <h6>{this.props.sideBarError}</h6>
                        </div>}
                </div>
            </div>
        )
    }
}
