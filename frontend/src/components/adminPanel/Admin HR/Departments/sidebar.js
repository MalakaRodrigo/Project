import React, {Component} from 'react'
import "./departments_style.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className="sideBarDepartmentsComponent">
                <h4 className="departmentsSideBarTitle">Employees who have not ben assigned to any departments</h4>
                <div className="departments_sidebar_employees_container">
                    {this.props.noDepEmployees.length > 0 ?
                        this.props.noDepEmployees.map((employee,index)=> {
                            let employee_style = ""
                            if(index%4==0){
                                employee_style = "departments_sidebar_employee0"
                            }else if(index%4==1){
                                employee_style = "departments_sidebar_employee0"
                            }else if(index%4==2){
                                employee_style = "departments_sidebar_employee0"
                            }else if(index%4==3){
                                employee_style = "departments_sidebar_employee0"
                            }
                            return(
                                <div className="departments_sidebar_employee"  id={employee_style} key={index}>
                                    <div className="departments_sidebar_employee_image">
                                        {
                                            employee.profileImage != "" ?
                                                <img className="departments_employee_avatar"
                                                     src={"http://localhost:8070/" + employee.profileImage} alt="No image"/>
                                                : <div></div>
                                        }
                                    </div>
                                    <h5 className="departments_sidebar_employee_name">{employee.name}</h5>
                                    <h5 className="departments_sidebar_employee_name">{employee.position}</h5>
                                    <h5 className="departments_sidebar_employee_name" id="departments_sidebar_employee_email">{employee.email}</h5>
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
