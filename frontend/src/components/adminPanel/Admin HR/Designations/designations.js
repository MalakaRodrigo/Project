import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Sidebar from "./sidebar";
import "./designations_style.css"

class Designations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department : this.props.location.state.detail,
            employees:[],
            employeesOfSelectedDes:[],
            sideBarTitle:"Employees of the Department",
            sideBarError:"There is no employees assigned to this department",
            designations_hidden_text_style:"des_hide_error_message",
            error_message:"Deleted Successfully"
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8070/employee/departmentEmployees/' + this.props.location.state.detail.Department._id)
            .then((res) => {
                this.setState({
                    employees: res.data,
                    employeesOfSelectedDes:res.data
                })
            })
            .catch(error => {
                alert("Error")
            })
    }

    displayEmployees(designation){
        let tempEmployees=[]
        if(this.state.employees.length>0){
            tempEmployees = this.state.employees.filter((val)=>{
                if(val.designation==designation._id){
                    return val
                }
            })
        }
        if (tempEmployees.length>0){
            this.setState({employeesOfSelectedDes:tempEmployees})
        }else{
            this.setState({
                sideBarError:"There is no employees assigned to this designation"
            })
        }
    }
    displayAllEmployees = () => {
        if(this.state.employees.length>0){
            this.setState({
                employeesOfSelectedDes:this.state.employees
            })
        }else {
            this.setState({
                sideBarError:"There is no employees assigned to this department"
            })
        }

    }
    deleteDepartment = () => {
        if(this.state.employees!=null&&this.state.employees.length>0){
            this.setState({
                designations_hidden_text_style:"des_display_error_message",
                error_message:"Sorry you can not delete the department as there are employees assigned to it."
            })
        }else{
            axios.post('http://localhost:8070/departments/deleteDepartment' ,{department_id:this.state.department.Department._id})
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            designations_hidden_text_style:"des_display_error_message",
                            error_message:"Successfully Deleted the department.",
                            employees:[],
                            employeesOfSelectedDes:[]
                        })
                        this.props.history.push({
                            pathname: "/hr/departments"
                        })
                    } else {
                        this.setState({
                            designations_hidden_text_style:"des_display_error_message",
                            error_message:"Error occurred while deleting the designation."
                        })
                    }
                })
                .catch(error => {
                    alert(error)
                })
        }

    }

    delete(designation){
        if(designation.employees.length>0){
            this.setState({
                designations_hidden_text_style:"des_display_error_message",
                error_message:"Sorry you can not delete the designation as there are employees assigned to it."
            })
        }else{
            axios.post('http://localhost:8070/designations/deleteDesignation/' ,{designation_id:designation._id})
                .then((res) => {
                    if (res.status == 200) {
                        axios.get('http://localhost:8070/departments/')
                            .then((result) => {
                                console.log("New departments",this.state.department.Department._id)
                                let newDepartment = result.data.filter(val=>{
                                    if(val.Department._id===this.state.department.Department._id){
                                        return val
                                    }
                                })
                                this.setState({
                                    department: newDepartment[0]
                                }, () => console.log("Department123", this.state.department))
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        this.setState({
                            designations_hidden_text_style:"des_display_error_message",
                            error_message:"Successfully deleted the designation."
                        })
                    } else {
                        this.setState({
                            designations_hidden_text_style:"des_display_error_message",
                            error_message:"Error occurred while deleting the designation."
                        })
                    }
                })
                .catch(error => {
                    alert(error)
                })
        }
    }

    render(){
        const {department} = this.state
        return(
            <div className="designationsMainComponent">
                <Sidebar
                    employees={this.state.employeesOfSelectedDes}
                    sideBarTitle={this.state.sideBarTitle}
                    sideBarError ={this.state.sideBarError}
                />
                <div className="designationsSubComponent">
                    <h5 className="hrText">Department Name : {department.Department.department_name}</h5>

                    <div className="departments_table_view">
                        <table className="designationsTable">
                            <tr className="designations_table_head">
                                <th className="designations_table_header_column">Designation</th>
                                <th className="designations_table_header_column">Description</th>
                                <th className="designations_table_header_column">Display Employees</th>
                                <th className="designations_table_header_column">Delete</th>
                            </tr>

                            {(department.Designations.length > 0&&department.Designations!=null) ? department.Designations.map((designation, index) => {
                                    if (index % 2 == 0) {
                                        return (
                                            <tr className="designations_table_data_odd" key={index}>
                                                <td className="designations_table_data_column">{designation.designation_name}</td>
                                                <td className="designations_table_data_column">{designation.designation_desc}</td>
                                                <td className="designations_table_data_column_more">
                                                    <div
                                                        className="designations_moreButton"
                                                        onClick={()=>this.displayEmployees(designation)}
                                                    >
                                                        Display Employees
                                                    </div>
                                                </td>
                                                <td className="designations_table_data_column_more">
                                                    <div
                                                        className="designations_moreButton"
                                                        onClick={() => this.delete(designation)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>

                                        )
                                    } else {
                                        return (
                                            <tr className="designations_table_data_even" key={index}>
                                                <td className="designations_table_data_column">{designation.designation_name}</td>
                                                <td className="designations_table_data_column">{designation.designation_desc}</td>
                                                <td className="designations_table_data_column_more">
                                                    <div
                                                        className="designations_moreButton"
                                                        onClick={()=>this.displayEmployees(designation)}
                                                    >
                                                        Display Employees
                                                    </div>
                                                </td>
                                                <td className="designations_table_data_column_more">
                                                    <div
                                                        className="designations_moreButton"
                                                        onClick={() => this.delete(designation)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>

                                        )
                                    }
                                })
                                :
                                <tr>
                                    <td colSpan="5" className="loadingText">Loading...</td>
                                </tr>
                            }
                        </table>
                    </div>

                    <div>
                        <div className={this.state.designations_hidden_text_style} onClick={this.displayAllEmployees}>
                            <h7 classsName="des_display_error_message">{this.state.error_message}</h7>
                        </div>
                        <div className="designations_display_all_button"  onClick={this.displayAllEmployees}>
                            Display All Employees
                        </div>
                        <div className="designations_display_all_button" onClick={this.deleteDepartment}>
                            Delete Department
                            <h7>   (Only if there are no employees)</h7>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(Designations);
