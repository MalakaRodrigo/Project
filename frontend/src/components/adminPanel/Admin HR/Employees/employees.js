// import React, {Component} from 'react'
// import {withRouter} from "react-router-dom";
// import axios from 'axios';
// import Sidebar from "./sidebar";
// import "./employees_style.css"
// import HRNavbar from "../HRNavBar/hr_navbar";
//
// class Employees extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             departments: [],
//             designations: [],
//             confirmPassword: "",
//             selectedDepartmentId: "",
//             errorStyle2: "no_error_message", errorMessage2: "",
//             errorStyle3: "no_error_message", errorMessage3: "",
//             errorStyle4: "no_error_message", errorMessage4: "",
//             registerEmployee: {name: "", email: "", password: "", role: "", position: "", department: "", designation: ""},
//             updateEmployee: {employee_id: "", new_password: ""},
//             updatePositionEmployee: {employee_id: "", department: "", designation: ""},
//             deleteEmployee: {employee_id: ""},
//             updatingDepartmentEmployees: [],
//             deletingDepartmentEmployees: [],
//             confirmDeleteContainerStyle:"hideDeleteConfirm",
//             confirmDeletion:false,
//             displayMenu:"hr_employeeMenu",
//             displayAdd:"no_hr_addEmployee",
//             displayPassword:"no_hr_updateEmployee",
//             displayPosition:"no_hr_updatePosition",
//             displayDelete:"no_hr_deleteEmployee"
//         }
//     }
//
//     componentDidMount() {
//         axios.get('http://localhost:8070/departments/')
//             .then((res) => {
//                 this.setState({
//                     departments: res.data
//                 }, () => console.log("Departments", this.state.departments))
//             })
//             .catch(error => {
//                 console.log(this.state.registerEmployee)
//             })
//     }
//
//     changeMenu = (menu) => {
//         if(menu=="add"){
//             this.setState({
//                 displayMenu:"no_hr_employeeMenu",
//                 displayAdd:"hr_addEmployee",
//                 displayPassword:"no_hr_updateEmployee",
//                 displayPosition:"no_hr_updatePosition",
//                 displayDelete:"no_hr_deleteEmployee"
//             })
//         }else if(menu=="menu"){
//             this.setState({
//                 displayMenu:"hr_employeeMenu",
//                 displayAdd:"no_hr_addEmployee",
//                 displayPassword:"no_hr_updateEmployee",
//                 displayPosition:"no_hr_updatePosition",
//                 displayDelete:"no_hr_deleteEmployee"
//             })
//         }else if(menu=="password"){
//             this.setState({
//                 displayMenu:"no_hr_employeeMenu",
//                 displayAdd:"no_hr_addEmployee",
//                 displayPassword:"hr_updateEmployee",
//                 displayPosition:"no_hr_updatePosition",
//                 displayDelete:"no_hr_deleteEmployee"
//             })
//         }else if(menu=="position"){
//             this.setState({
//                 displayMenu:"no_hr_employeeMenu",
//                 displayAdd:"no_hr_addEmployee",
//                 displayPassword:"no_hr_updateEmployee",
//                 displayPosition:"hr_updatePosition",
//                 displayDelete:"no_hr_deleteEmployee"
//             })
//         }else if(menu=="delete"){
//             this.setState({
//                 displayMenu:"no_hr_employeeMenu",
//                 displayAdd:"no_hr_addEmployee",
//                 displayPassword:"no_hr_updateEmployee",
//                 displayPosition:"no_hr_updatePosition",
//                 displayDelete:"hr_deleteEmployee"
//             })
//         }
//     }
//
//     addEmployee = () => {
//         this.setState({
//             errorStyle: "no_error_message"
//         }, () => {
//             if (this.state.registerEmployee.name == "" ||
//                 this.state.registerEmployee.email == "" ||
//                 this.state.registerEmployee.password == "" ||
//                 this.state.registerEmployee.role == "" ||
//                 this.state.registerEmployee.department == "" ||
//                 this.state.registerEmployee.designation == "" ||
//                 this.state.confirmPassword == "") {
//                 this.setState({
//                     errorMessage: "Please Fill Every Information!",
//                     errorStyle: "error_message"
//                 })
//             } else {
//                 const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
//                 const result = pattern.test(this.state.registerEmployee.email);
//                 if (result === true) {
//                     if (this.state.registerEmployee.password == this.state.confirmPassword) {
//                         axios.post('http://localhost:8070/employee/register', this.state.registerEmployee)
//                             .then((res) => {
//                                 if (res.status == 200) {
//                                     this.setState({
//                                         errorMessage: "Employee Added Successfully! ",
//                                         errorStyle: "error_message",
//                                         registerEmployee: {
//                                             name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
//                                         },
//                                         confirmPassword: ""
//                                     })
//                                 } else {
//                                     this.setState({
//                                         errorMessage: "Could not Added Employee ",
//                                         errorStyle: "error_message",
//                                         registerEmployee: {
//                                             name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
//                                         },
//                                         confirmPassword: ""
//                                     })
//                                 }
//                             })
//                             .catch(error => {
//                                 this.setState({
//                                     errorMessage: "Could not Added Employee ",
//                                     errorStyle: "error_message",
//                                     registerEmployee: {
//                                         name: "", email: "", password: "", role: "", position: "", department: "", designation: ""
//                                     },
//                                     confirmPassword: ""
//                                 })
//                             })
//                     } else {
//                         this.setState({
//                             errorMessage: "Passwords Do Not Match!",
//                             errorStyle: "error_message"
//                         })
//                     }
//                 } else {
//                     this.setState({
//                         errorMessage: "Invalid Email!",
//                         errorStyle: "error_message"
//                     })
//                 }
//             }
//         })
//     }
//
//     selectDepartment = (e) => {
//         this.state.departments.filter((val) => {
//             if (e.target.value == val.Department._id) {
//                 return val
//             }
//         }).map((department, index) => {
//             this.setState({
//                 designations: department.Designations,
//                 registerEmployee: {
//                     ...this.state.registerEmployee,
//                     department: e.target.value
//                 }
//             })
//         })
//     }
//
//     selectUpdatePositionDepartment = (e) => {
//         this.state.departments.filter((val) => {
//             if (e.target.value == val.Department._id) {
//                 return val
//             }
//         }).map((department, index) => {
//             this.setState({
//                 designations: department.Designations,
//                 updatePositionEmployee: {
//                     ...this.state.updatePositionEmployee,
//                     department: e.target.value
//                 }
//             })
//         })
//     }
//
//     selectDesignation = (e) => {
//         const designation_name = this.state.designations.filter((val) => {
//             if (e.target.value == val._id) {
//                 return val
//             }
//         })
//         this.setState({
//             registerEmployee: {
//                 ...this.state.registerEmployee,
//                 designation: e.target.value,
//                 position: designation_name[0].designation_name
//             }
//         })
//     }
//     selectUpdatePositionDesignation = (e) => {
//         const designation_name = this.state.designations.filter((val) => {
//             if (e.target.value == val._id) {
//                 return val
//             }
//         })
//         this.setState({
//             updatePositionEmployee: {
//                 ...this.state.updatePositionEmployee,
//                 designation: e.target.value,
//                 position: designation_name[0].designation_name
//             }
//         })
//     }
//
//     selectUpdatingEmployeeDepartment = (e) => {
//         axios.get('http://localhost:8070/employee/departmentEmployees/' + e.target.value)
//             .then((res) => {
//                 this.setState({
//                     updatingDepartmentEmployees: res.data
//                 })
//             })
//             .catch(error => {
//                alert("Error")
//             })
//     }
//
//     selectDeletingEmployeeDepartment = (e) => {
//         axios.get('http://localhost:8070/employee/departmentEmployees/' + e.target.value)
//             .then((res) => {
//                 this.setState({
//                     deletingDepartmentEmployees: res.data
//                 })
//             })
//             .catch(error => {
//                 alert("Error")
//             })
//     }
//
//     updatePassword = () => {
//         console.log(this.state.updateEmployee,this.state.confirmPassword)
//         this.setState({
//             errorStyle2: "no_error_message"
//         }, () => {
//             if (
//                 this.state.updateEmployee.new_password == "" ||
//                 this.state.updateEmployee.employee_id == "" ||
//                 this.state.confirmPassword == "") {
//                 this.setState({
//                     errorMessage2: "Please Fill Every Information!",
//                     errorStyle2: "error_message"
//                 })
//             } else {
//                 if(this.state.updateEmployee.new_password == this.state.confirmPassword){
//                     axios.post('http://localhost:8070/employee/updatePasswordAdmin', this.state.updateEmployee)
//                         .then((res) => {
//                             if (res.status == 200) {
//                                 this.setState({
//                                     errorMessage2: "Password Updated Successfully! ",
//                                     errorStyle2: "error_message",
//                                     updateEmployee: {employee_id: "", new_password: ""},
//                                     confirmPassword: ""
//                                 })
//                             } else {
//                                 this.setState({
//                                     errorMessage2: "Could not Update Password ",
//                                     errorStyle2: "error_message",
//                                     updateEmployee: {employee_id: "", new_password: ""},
//                                     confirmPassword: ""
//                                 })
//                             }
//                         })
//                         .catch(error => {
//                             this.setState({
//                                 errorMessage2: "Could not Update Password",
//                                 errorStyle2: "error_message",
//                                 updateEmployee: {employee_id: "", new_password: ""},
//                                 confirmPassword: ""
//                             })
//                         })
//                 }else{
//                     this.setState({
//                         errorMessage2: "Passwords Do Not Match!",
//                         errorStyle2: "error_message"
//                     })
//                 }
//             }
//         })
//     }
//
//     updatePosition = () => {
//         console.log(this.state.updatePositionEmployee)
//         this.setState({
//             errorStyle3: "no_error_message"
//         }, () => {
//             if (
//                 this.state.updatePositionEmployee.employee_id == "" ||
//                 this.state.updatePositionEmployee.department == "" ||
//                 this.state.updatePositionEmployee.position == "" ||
//                 this.state.updatePositionEmployee.designation == "" ) {
//                 this.setState({
//                     errorMessage3: "Please Fill Every Information!",
//                     errorStyle3: "error_message"
//                 })
//             } else {
//                 axios.post('http://localhost:8070/employee/updatePositionAdmin', this.state.updatePositionEmployee)
//                     .then((res) => {
//                         if (res.status == 200) {
//                             this.setState({
//                                 errorMessage3: "Position Updated Successfully! ",
//                                 errorStyle3: "error_message",
//                                 updatePositionEmployee: {employee_id: "", position:"", department:"",designation:""},
//                             })
//                         } else {
//                             this.setState({
//                                 errorMessage3: "Could not Update Position ",
//                                 errorStyle3: "error_message",
//                                 updatePositionEmployee: {employee_id: "",position:"",  department:"",designation:""},
//                             })
//                         }
//                     })
//                     .catch(error => {
//                         this.setState({
//                             errorMessage3: "Could not Update Position ",
//                             errorStyle3: "error_message",
//                             updatePositionEmployee: {employee_id: "", position:"", department:"",designation:""},
//                         })
//                     })
//             }
//         })
//     }
//
//     deleteAccount = () =>{
//         if (
//             this.state.deleteEmployee.employee_id=="") {
//             this.setState({
//                 errorMessage4: "Please Fill Every Information!",
//                 errorStyle4: "error_message"
//             })
//         } else {
//             this.setState({
//                 confirmDeleteContainerStyle:"showDeleteConfirm",
//                 errorStyle4: "no_error_message"
//             })
//         }
//     }
//     cancelDeletion = () => {this.setState({
//         confirmDeleteContainerStyle:"hideDeleteConfirm",
//         deleteEmployee: {employee_id: ""},
//
//     })}
//
//     continueDeletion = () => {
//         this.setState({
//             confirmDeleteContainerStyle:"hideDeleteConfirm"
//         },()=>{
//                 axios.post('http://localhost:8070/employee/deleteEmployee', this.state.deleteEmployee)
//                     .then((res) => {
//                         if (res.status == 200) {
//                             this.setState({
//                                 errorMessage4: "Deleting Account Successfully! ",
//                                 errorStyle4: "error_message",
//                                 deleteEmployee: {employee_id: ""},
//                             })
//                         } else {
//                             this.setState({
//                                 errorMessage4: "Could not Update Position ",
//                                 errorStyle4: "error_message",
//                                 deleteEmployee: {employee_id: ""},
//                             })
//                         }
//                     })
//                     .catch(error => {
//                         this.setState({
//                             errorMessage4: "Could not Update Position ",
//                             errorStyle4: "error_message",
//                             deleteEmployee: {employee_id: ""},
//                         })
//                     })
//         })
//     }
//
//     render() {
//         return (
//             <div className="hr_employeesMainComponent">
//                 <HRNavbar/>
//                 <Sidebar/>
//                 <div className="hr_employeesSubComponent">
//                     <div className={this.state.displayMenu}>
//                         <h5 className="hrTitleText">Menu</h5>
//                         <div className="menuContainer">
//                             <div className="menuItem" onClick={()=>this.changeMenu("add")}><h5 className="menuItemText">Add Employee</h5></div>
//                             <div className="menuItem" onClick={()=>this.changeMenu("password")}><h5 className="menuItemText">Update Password</h5></div>
//                             <div className="menuItem" onClick={()=>this.changeMenu("position")}><h5 className="menuItemText">Update Position</h5></div>
//                             <div className="menuItem" onClick={()=>this.changeMenu("delete")}><h5 className="menuItemText">Delete Account</h5></div>
//                         </div>
//                     </div>
//                     <div className={this.state.displayAdd}>
//                         <h5 className="hrTitleText">Add Employee</h5>
//                         <form className="hr_employeeForm">
//                             <div className="hr_employeeFormSub">
//                                 <label className="hr_employeeLabel">
//                                     Employee Name
//                                     <input
//                                         value={this.state.registerEmployee.name}
//                                         className="hr_employeeTextInput"
//                                         type="text"
//                                         placeholder="Full Name"
//                                         onChange={e => {
//                                             this.setState({
//                                                 registerEmployee: {
//                                                     ...this.state.registerEmployee,
//                                                     name: e.target.value
//                                                 }
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Email
//                                     <input
//                                         value={this.state.registerEmployee.email}
//                                         placeholder="Enter Email"
//                                         className="hr_employeeTextInput"
//                                         type="text"
//                                         onChange={e => {
//                                             this.setState({
//                                                 registerEmployee: {
//                                                     ...this.state.registerEmployee,
//                                                     email: e.target.value
//                                                 }
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Password
//                                     <input
//                                         value={this.state.registerEmployee.password}
//                                         className="hr_employeeTextInput"
//                                         type="password"
//                                         placeholder="Enter Password"
//                                         onChange={e => {
//                                             this.setState({
//                                                 registerEmployee: {
//                                                     ...this.state.registerEmployee,
//                                                     password: e.target.value
//                                                 }
//                                             })
//                                         }}
//                                     />
//                                 </label>
//
//                                 <label className="hr_employeeLabel">
//                                     Confirm Password
//                                     <input
//                                         value={this.state.confirmPassword}
//                                         className="hr_employeeTextInput"
//                                         type="password"
//                                         placeholder="Confirm Password"
//                                         onChange={e => {
//                                             this.setState({
//                                                 confirmPassword: e.target.value
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Department
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectDepartment(e)
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select a Department --</option>
//                                         {this.state.departments.map(item => {
//                                             return (<option key={item.Department._id}
//                                                             value={item.Department._id}>{item.Department.department_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Designation
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectDesignation(e);
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select a Designation (After Selecting
//                                             Department) --
//                                         </option>
//                                         {this.state.designations.map(item => {
//                                             return (<option key={item._id}
//                                                             value={item._id}>{item.designation_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Role
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.setState({
//                                                     registerEmployee: {
//                                                         ...this.state.registerEmployee,
//                                                         role: e.target.value
//                                                     }
//                                                 })
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select the Role --</option>
//                                         <option key="admin" value="1">Administrator</option>
//                                         <option key="no-admin" value="0">Employee</option>
//                                     </select>
//                                 </label>
//                                 <h7 className={this.state.errorStyle}>{this.state.errorMessage}</h7>
//                             </div>
//                             <div>
//                                 <div className="hr_employee_addButtonContainer" onClick={this.addEmployee}>
//                                     <h7 className="hr_employee_addButton">Add Employee</h7>
//                                 </div>
//                             </div>
//                             <div>
//                                 <div className="hr_employee_addButtonContainer" onClick={this.addEmployee}>
//                                     <h7 className="hr_employee_addButton">Add Employee</h7>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                     <div className={this.state.displayPassword}>
//                         <h5 className="hrTitleText">Update Employee's Password</h5>
//                         <form className="hr_employeeForm">
//                             <div className="hr_employeeFormSub">
//                                 <label className="hr_employeeLabel">
//                                     Password
//                                     <input
//                                         value={this.state.updateEmployee.password}
//                                         className="hr_employeeTextInput"
//                                         type="password"
//                                         placeholder="Enter Password"
//                                         onChange={e => {
//                                             this.setState({
//                                                 updateEmployee: {
//                                                     ...this.state.updateEmployee,
//                                                     new_password: e.target.value
//                                                 }
//                                             })
//                                         }}
//                                     />
//                                 </label>
//
//                                 <label className="hr_employeeLabel">
//                                     Confirm Password
//                                     <input
//                                         value={this.state.confirmPassword}
//                                         className="hr_employeeTextInput"
//                                         type="password"
//                                         placeholder="Confirm Password"
//                                         onChange={e => {
//                                             this.setState({
//                                                 confirmPassword: e.target.value
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Select The Department of Employee
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectUpdatingEmployeeDepartment(e)
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select The Department--</option>
//                                         {this.state.departments.map(item => {
//                                             return (<option key={item.Department._id}
//                                                             value={item.Department._id}>{item.Department.department_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Select The Employee To be Updated
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.setState({
//                                                     updateEmployee: {
//                                                         ...this.state.updateEmployee,
//                                                         employee_id: e.target.value
//                                                     }
//                                                 })
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select the Employee --</option>
//                                         {this.state.updatingDepartmentEmployees.map(item => {
//                                             return (<option key={item._id}
//                                                             value={item._id}>{item.name} -- {item.email}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <h7 className={this.state.errorStyle2}>{this.state.errorMessage2}</h7>
//                             </div>
//                             <div>
//                                 <div className="hr_employee_addButtonContainer" onClick={this.updatePassword}>
//                                     <h7 className="hr_employee_addButton">Update Password</h7>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                     <div className={this.state.displayPosition}>
//                         <h5 className="hrTitleText">Update Employee's Position</h5>
//                         <form className="hr_employeeForm">
//                             <div className="hr_employeeFormSub">
//                                 <label className="hr_employeeLabel">
//                                     Select The Current Department of Employee
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectUpdatingEmployeeDepartment(e)
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select The Department--</option>
//                                         {this.state.departments.map(item => {
//                                             return (<option key={item.Department._id}
//                                                             value={item.Department._id}>{item.Department.department_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Select The Employee To be Updated
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.setState({
//                                                     updatePositionEmployee: {
//                                                         ...this.state.updatePositionEmployee,
//                                                         employee_id: e.target.value
//                                                     }
//                                                 })
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select the Employee --</option>
//                                         {this.state.updatingDepartmentEmployees.map(item => {
//                                             return (<option key={item._id}
//                                                             value={item._id}>{item.name} -- {item.email}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     New Department
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectUpdatePositionDepartment(e)
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select a Department --</option>
//                                         {this.state.departments.map(item => {
//                                             return (<option key={item.Department._id}
//                                                             value={item.Department._id}>{item.Department.department_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     New Designation
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectUpdatePositionDesignation(e);
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select a Designation (After Selecting
//                                             Department) --
//                                         </option>
//                                         {this.state.designations.map(item => {
//                                             return (<option key={item._id}
//                                                             value={item._id}>{item.designation_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <h7 className={this.state.errorStyle3}>{this.state.errorMessage3}</h7>
//                             </div>
//                             <div>
//                                 <div className="hr_employee_addButtonContainer" onClick={this.updatePosition}>
//                                     <h7 className="hr_employee_addButton">Update Position</h7>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                     <div className={this.state.displayDelete}>
//                         <h5 className="hrTitleText">Delete Employee</h5>
//                         <form className="hr_employeeForm">
//                             <div className="hr_employeeFormSub">
//                                 <label className="hr_employeeLabel">
//                                     Select The Department of Employee
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.selectDeletingEmployeeDepartment(e)
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select The Department--</option>
//                                         {this.state.departments.map(item => {
//                                             return (<option key={item.Department._id}
//                                                             value={item.Department._id}>{item.Department.department_name}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <label className="hr_employeeLabel">
//                                     Select The Employee To be Deleted
//                                     <select className="form-select form-select-sm employee_select "
//                                             defaultValue={""}
//                                             onChange={e => {
//                                                 this.setState({
//                                                     deleteEmployee: {
//                                                         ...this.state.deleteEmployee,
//                                                         employee_id: e.target.value
//                                                     }
//                                                 })
//                                             }}
//                                     >
//                                         <option disabled value={""}> -- Select the Employee --</option>
//                                         {this.state.deletingDepartmentEmployees.map(item => {
//                                             return (<option key={item._id}
//                                                             value={item._id}>{item.name} -- {item.email}</option>);
//                                         })}
//                                     </select>
//                                 </label>
//                                 <h7 className={this.state.errorStyle4}>{this.state.errorMessage4}</h7>
//                                 <div className={this.state.confirmDeleteContainerStyle}>
//                                     <h7 className="confirmDeleteText">Do you want to delete the account?</h7>
//                                     <div className="deleteButtonsContainer">
//                                         <div className="deleteCancelButton" onClick={this.cancelDeletion}><h7>Cancel</h7></div>
//                                         <div className="deleteConfirmButton" onClick={this.continueDeletion}><h7>Delete</h7></div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <div className="hr_employee_addButtonContainer" onClick={this.deleteAccount}>
//                                     <h7 className="hr_employee_addButton" >Delete Employee</h7>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }
//
// export default withRouter(Employees)