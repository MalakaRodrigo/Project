const Employee = require('../models/employee')
const Departments = require('../models/departments')
const Designations = require('../models/designations')
const Task = require("../models/task");

// ************* Show the list of departments *************************

function getDesignations(designation){
    return new Promise((resolve,reject) => {
       Designations.findById(designation,(err,pat) => resolve(pat))
    })
}

function getDepartment(department){
    return new Promise((resolve,reject) => {
        let designations = department.designations
        Promise.all(designations.map(desisgnation => getDesignations(desisgnation)))
            .then(arr => {
                resolve({
                    'Department':department,
                    'Designations':arr
                })
            })
    })
}

const index = (req, res, next) => {
    let departments = []
    Departments.find()
        .then(response => {
            Promise.all( response.map(department => getDepartment(department)))
                .then(arr => {
                    res.json(arr)
                })
        })
        .catch(error => {
            res.json({
                message: 'An error occurred!' + error
            })
        })
}

// *********************** Add a department ***************************
const addDepartment = (req, res) => {
    let department_name = req.body.department_name;
    let department_desc = req.body.department_desc;
    let designations = req.body.designations;
    let employees = req.body.employees;

    // Check whether the employee is existing

    // Check whether the project is existing
    if (department_name == null || department_desc == null) {
        res.json({
            message: "One or more of request paramaters are empty."
        })
    } else {
        Departments.find({department_name:department_name})
            .then(departments=> {
                if (departments.length>0){
                    return res.status(400).json({Error: "Departments Already existing"});
                }else{
                    let department = new Departments({
                        department_name: department_name,
                        department_desc: department_desc,
                        designations: designations,
                        employees: employees
                    })

                    department.save()
                        .then(response => {
                            res.json({
                                message: "Successfully added department"
                            })
                        })
                        .catch(error => {
                            res.json({
                                message: error
                            })
                        })
                }
            })
    }
}

// ******************** Delete A Department ***************************
const deleteDepartment= async (req,res) => {

    if(req.body.department_id==null){
        res.json({
            message : "Department Id is empty"
        })
    }else{
        Departments.findById(req.body.department_id)
            .then(departments=> {
                if (departments.employees.length==0&&departments.designations.length==0){
                    Departments.findByIdAndDelete(req.body.department_id)
                        .then(response => {
                            res.json({
                                message:"Successfully deleted department",
                                response
                            })
                        })
                        .catch(error => {
                            res.json({
                                message : 'An error occurred!'
                            })
                        })
                }else{
                    res.json({
                        Error:"Cannot delete department as there are employees or designations in the department"
                    })
                }
            })
    }
}

module.exports = {
    addDepartment,
    index,
    deleteDepartment
}

