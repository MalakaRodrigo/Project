import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import axios from 'axios';
import Sidebar from "../sidebar";
import "../employees_style.css"

class UpdatePosition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            designations: [],
            employees: [],
            errorStyle3: "no_error_message", errorMessage3: "",
            updatePositionEmployee: {employee_id: "", department: "", designation: ""},
            updatingDepartmentEmployees: [],
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8070/departments/')
            .then((res) => {
                axios.get('http://localhost:8070/employee/allEmployees')
                    .then((res2) => {
                        this.setState({
                            employees: res2.data,
                            departments: res.data
                        })
                    })
                    .catch(error => {
                        alert(error)
                    })

            })
            .catch(error => {
                console.log(this.state.registerEmployee)
            })
    }

    changeMenu = (menu) => {
        this.props.history.push("menu")
    }

    selectUpdatePositionDepartment = (e) => {
        this.state.departments.filter((val) => {
            if (e.target.value == val.Department._id) {
                return val
            }
        }).map((department, index) => {
            this.setState({
                designations: department.Designations,
                updatePositionEmployee: {
                    ...this.state.updatePositionEmployee,
                    department: e.target.value
                }
            })
        })
    }

    selectUpdatePositionDesignation = (e) => {
        const designation_name = this.state.designations.filter((val) => {
            if (e.target.value == val._id) {
                return val
            }
        })
        this.setState({
            updatePositionEmployee: {
                ...this.state.updatePositionEmployee,
                designation: e.target.value,
                position: designation_name[0].designation_name
            }
        })
    }

    selectUpdatingEmployeeDepartment = (e) => {
        axios.get('http://localhost:8070/employee/departmentEmployees/' + e.target.value)
            .then((res) => {
                this.setState({
                    updatingDepartmentEmployees: res.data
                })
            })
            .catch(error => {
                alert("Error")
            })
    }

    updatePosition = () => {
        console.log(this.state.updatePositionEmployee)
        this.setState({
            errorStyle3: "no_error_message"
        }, () => {
            if (
                this.state.updatePositionEmployee.employee_id == "" ||
                this.state.updatePositionEmployee.department == "" ||
                this.state.updatePositionEmployee.position == "" ||
                this.state.updatePositionEmployee.designation == "") {
                this.setState({
                    errorMessage3: "Please Fill Every Information!",
                    errorStyle3: "error_message"
                })
            } else {
                axios.post('http://localhost:8070/employee/updatePositionAdmin', this.state.updatePositionEmployee)
                    .then((res) => {
                        if (res.status == 200) {
                            this.setState({
                                errorMessage3: "Position Updated Successfully! ",
                                errorStyle3: "error_message",
                                updatePositionEmployee: {
                                    employee_id: "",
                                    position: "",
                                    department: "",
                                    designation: ""
                                },
                            })
                        } else {
                            this.setState({
                                errorMessage3: "Could not Update Position ",
                                errorStyle3: "error_message",
                                updatePositionEmployee: {
                                    employee_id: "",
                                    position: "",
                                    department: "",
                                    designation: ""
                                },
                            })
                        }
                    })
                    .catch(error => {
                        this.setState({
                            errorMessage3: "Could not Update Position ",
                            errorStyle3: "error_message",
                            updatePositionEmployee: {employee_id: "", position: "", department: "", designation: ""},
                        })
                    })
            }
        })
    }

    render() {

        return (
            <div className="hr_employeesMainComponent">
                <Sidebar elementStyle="In Progress"/>
                <div className="hr_employeesSubComponent">
                    <div className="hr_updatePosition">
                        <h5 className="hrTitleText">Update Employee's Position</h5>
                        <form className="hr_employeeForm">
                            <div className="hr_employeeFormSub">
                                <label className="hr_employeeLabel">
                                    Select The Employee To be Updated
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.setState({
                                                    updatePositionEmployee: {
                                                        ...this.state.updatePositionEmployee,
                                                        employee_id: e.target.value
                                                    }
                                                })
                                            }}
                                    >
                                        <option disabled value={""}> -- Select the Employee --</option>
                                        {this.state.employees.map(item => {
                                            return (<option key={item._id}
                                                            value={item._id}>{item.name} -- {item.email}</option>);
                                        })}
                                    </select>
                                </label>
                                <label className="hr_employeeLabel">
                                    New Department
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.selectUpdatePositionDepartment(e)
                                            }}
                                    >
                                        <option disabled value={""}> -- Select a Department --</option>
                                        {this.state.departments.map(item => {
                                            return (<option key={item.Department._id}
                                                            value={item.Department._id}>{item.Department.department_name}</option>);
                                        })}
                                    </select>
                                </label>
                                <label className="hr_employeeLabel">
                                    New Designation
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.selectUpdatePositionDesignation(e);
                                            }}
                                    >
                                        <option disabled value={""}> -- Select a Designation (After Selecting
                                            Department) --
                                        </option>
                                        {this.state.designations.map(item => {
                                            return (<option key={item._id}
                                                            value={item._id}>{item.designation_name}</option>);
                                        })}
                                    </select>
                                </label>
                                <h7 className={this.state.errorStyle3}>{this.state.errorMessage3}</h7>
                            </div>
                            <div className="employeeButtonsContainer">
                                <div className="hr_employee_addButtonContainer" onClick={this.updatePosition}>
                                    <h7 className="hr_employee_addButton">Update Position</h7>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UpdatePosition)