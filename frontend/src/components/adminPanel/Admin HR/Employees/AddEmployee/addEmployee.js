import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import axios from 'axios';
import Sidebar from "../sidebar";
import "../employees_style.css"

class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            designations: [],
            designationsWithoutDep:[],
            confirmPassword: "",
            selectedDepartmentId: "",
            errorStyle: "no_error_message", errorMessage: "",
            registerEmployee: {name: "", email: "", password: "", role: "", position: "", department: "", designation: ""},
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8070/departments/')
            .then((res) => {
                axios.get('http://localhost:8070/designations/')
                    .then(res2 => {
                        let temDes = res2.data.response.filter(val=>{
                            if(val.department==null){
                                return val
                            }
                        })
                        this.setState({
                            departments: res.data,
                            designations:temDes,
                            designationsWithoutDep:temDes
                        })
                    })
            })
            .catch(error => {
                console.log(this.state.registerEmployee)
            })
    }

    changeMenu = (menu) => {
        this.props.history.push("menu")
    }

    addEmployee = () => {
        this.setState({
            errorStyle: "no_error_message"
        }, () => {
            if (this.state.registerEmployee.name == "" ||
                this.state.registerEmployee.email == "" ||
                this.state.registerEmployee.password == "" ||
                this.state.registerEmployee.role == "" ||
                this.state.registerEmployee.designation == "" ||
                this.state.confirmPassword == "") {
                this.setState({
                    errorMessage: "Please Fill Every Information!",
                    errorStyle: "error_message"
                })
            } else {
                const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
                const result = pattern.test(this.state.registerEmployee.email);
                if (result === true) {
                    if (this.state.registerEmployee.password == this.state.confirmPassword) {
                        axios.post('http://localhost:8070/employee/register', this.state.registerEmployee)
                            .then((res) => {
                                if (res.status == 200) {
                                    this.setState({
                                        errorMessage: "Employee Added Successfully! ",
                                        errorStyle: "error_message",
                                        registerEmployee: {
                                            name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
                                        },
                                        confirmPassword: ""
                                    })
                                } else {
                                    this.setState({
                                        errorMessage: "Could not Added Employee ",
                                        errorStyle: "error_message",
                                        registerEmployee: {
                                            name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
                                        },
                                        confirmPassword: ""
                                    })
                                }
                            })
                            .catch(error => {
                                this.setState({
                                    errorMessage: "Could not Added Employee ",
                                    errorStyle: "error_message",
                                    registerEmployee: {
                                        name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
                                    },
                                    confirmPassword: ""
                                })
                            })
                    } else {
                        this.setState({
                            errorMessage: "Passwords Do Not Match!",
                            errorStyle: "error_message"
                        })
                    }
                } else {
                    this.setState({
                        errorMessage: "Invalid Email!",
                        errorStyle: "error_message"
                    })
                }
            }
        })
    }

    selectDepartment = (e) => {
        if(e.target.value==0){
            this.setState({
                registerEmployee: {
                    ...this.state.registerEmployee,
                    department: ""
                },
                designations:this.state.designationsWithoutDep
            })
        }else{
            this.state.departments.filter((val) => {
                if (e.target.value == val.Department._id) {
                    return val
                }
            }).map((department, index) => {
                this.setState({
                    designations: department.Designations,
                    registerEmployee: {
                        ...this.state.registerEmployee,
                        department: e.target.value
                    }
                })
            })
        }

    }
    selectDesignation = (e) => {
        const designation_name = this.state.designations.filter((val) => {
            if (e.target.value == val._id) {
                return val
            }
        })
        this.setState({
            registerEmployee: {
                ...this.state.registerEmployee,
                designation: e.target.value,
                position: designation_name[0].designation_name
            }
        })
    }


    render() {
        return (
            <div className="hr_employeesMainComponent">
                <Sidebar elementStyle="All"/>
                <div className="hr_employeesSubComponent">
                    <div className="hr_addEmployee">
                        <h5 className="hrTitleText">Add Employee</h5>
                        <form className="hr_employeeForm">
                            <div className="hr_employeeFormSub">
                                <label className="hr_employeeLabel">
                                    Employee Name
                                    <input
                                        value={this.state.registerEmployee.name}
                                        className="hr_employeeTextInput"
                                        type="text"
                                        placeholder="Full Name"
                                        onChange={e => {
                                            this.setState({
                                                registerEmployee: {
                                                    ...this.state.registerEmployee,
                                                    name: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </label>
                                <label className="hr_employeeLabel">
                                    Email
                                    <input
                                        value={this.state.registerEmployee.email}
                                        placeholder="Enter Email"
                                        className="hr_employeeTextInput"
                                        type="text"
                                        onChange={e => {
                                            this.setState({
                                                registerEmployee: {
                                                    ...this.state.registerEmployee,
                                                    email: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </label>
                                <label className="hr_employeeLabel">
                                    Password
                                    <input
                                        value={this.state.registerEmployee.password}
                                        className="hr_employeeTextInput"
                                        type="password"
                                        placeholder="Enter Password"
                                        onChange={e => {
                                            this.setState({
                                                registerEmployee: {
                                                    ...this.state.registerEmployee,
                                                    password: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </label>

                                <label className="hr_employeeLabel">
                                    Confirm Password
                                    <input
                                        value={this.state.confirmPassword}
                                        className="hr_employeeTextInput"
                                        type="password"
                                        placeholder="Confirm Password"
                                        onChange={e => {
                                            this.setState({
                                                confirmPassword: e.target.value
                                            })
                                        }}
                                    />
                                </label>
                                <label className="hr_employeeLabel">
                                    Department
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.selectDepartment(e)
                                            }}
                                    >
                                        <option disabled value={""}> -- Select a Department --</option>
                                        {this.state.departments.map(item => {
                                            return (<option key={item.Department._id}
                                                            value={item.Department._id}>{item.Department.department_name}</option>);
                                        })}
                                        <option key="no-admin" value="0">No Department</option>
                                    </select>
                                </label>
                                <label className="hr_employeeLabel">
                                    Designation
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.selectDesignation(e);
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
                                <label className="hr_employeeLabel">
                                    Role
                                    <select className="form-select form-select-sm employee_select "
                                            defaultValue={""}
                                            onChange={e => {
                                                this.setState({
                                                    registerEmployee: {
                                                        ...this.state.registerEmployee,
                                                        role: e.target.value
                                                    }
                                                })
                                            }}
                                    >
                                        <option disabled value={""}> -- Select the Role --</option>
                                        <option key="admin" value="1">Administrator</option>
                                        <option key="no-admin" value="0">Employee</option>
                                    </select>
                                </label>
                                <h7 className={this.state.errorStyle}>{this.state.errorMessage}</h7>
                            </div>
                            <div className="employeeButtonsContainer">
                                <div className="hr_employee_addButtonContainer" onClick={this.addEmployee}>
                                    <h7 className="hr_employee_addButton">Add Employee</h7>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AddEmployee)