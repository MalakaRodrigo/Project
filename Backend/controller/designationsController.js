const Employee = require('../models/employee')
const Departments = require('../models/departments')
const Designations = require('../models/designations')
const Task = require("../models/task");
const {response} = require("express");

// ************* Show the list of departments *************************
const index = (req, res, next) => {
    Designations.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occurred!' + error
            })
        })
}

// *********************** Add a department ***************************
const addDesignation = (req, res) => {
    let designation_name = req.body.designation_name;
    let designation_desc = req.body.designation_desc;
    let department = req.body.department;

    if (designation_name == null || designation_desc == null) {
        res.json({
            message: "One or more of request paramaters are empty."
        })
    } else {
        Designations.find({designation_name: designation_name, department: department})
            .then(designations => {
                if (designations.length > 0) {
                    return res.status(400).json({Error: "Designation is already existing in that department"});
                } else {
                    if(department==null||department==""){
                        let designation = new Designations({
                            designation_name: designation_name,
                            designation_desc: designation_desc,
                        })
                        designation.save()
                            .then(response => {
                                res.json({
                                    message: "Successfully added designation",
                                    designation: response
                                })
                            })
                            .catch(error => {
                                res.json({
                                    message: error
                                })
                            })
                    }else{
                        let designation = new Designations({
                            designation_name: designation_name,
                            designation_desc: designation_desc,
                            department: department
                        })

                        designation.save()
                            .then(response => {
                                Departments.findById(department)
                                    .then(departmentFromDB => {
                                        // Update the department's designations array
                                        let existingDesignationsOfDepartment = departmentFromDB.designations
                                        existingDesignationsOfDepartment.push(response.id)
                                        let updatedDepartment = {
                                            designations: existingDesignationsOfDepartment
                                        }
                                        Departments.findByIdAndUpdate(department, updatedDepartment)
                                            .then(resultFromUpdatedDepartment => {
                                                Departments.findById(department)
                                                    .then(resultAfterUpdating => {
                                                        res.json({
                                                            message: "Successfully added designation",
                                                            designation: response,
                                                            department: resultAfterUpdating
                                                        })
                                                    })
                                            })
                                            .catch(error => {
                                                res.json({
                                                    message: error
                                                })
                                            })
                                            .catch(error => {
                                                res.json({
                                                    message: error
                                                })
                                            })
                                    })
                            })
                            .catch(error => {
                                res.json({
                                    message: error
                                })
                            })
                    }
                }
            })
    }
}

// ******************** Delete A Designation ***************************
const deleteDesignation= async (req,res) => {

    if(req.body.designation_id==null){
        res.json({
            message : "Designation Id is empty"
        })
    }else{
        Designations.findById(req.body.designation_id)
            .then(designation=> {
                if (designation.employees.length==0){
                    Designations.findByIdAndDelete(req.body.designation_id)
                        .then(response => {
                            Departments.findById(response.department)
                                .then(result=>{
                                    let designationsOfDep = result.designations
                                    let updatedDesignations = designationsOfDep.filter(value=>{
                                        if(value!=response._id){
                                            return value
                                        }
                                    })
                                    Departments.findByIdAndUpdate(response.department,{designations:updatedDesignations})
                                        .then(result2=>{
                                            res.json({result:result2,message:"Successfully deleted the designation"})
                                        })
                                        .catch(error=>{
                                            res.json(error)
                                        })
                                })
                                .catch(error=>{
                                    res.json(error)
                                })
                        })
                        .catch(error => {
                            res.json({
                                message : 'An error occurred!',
                                error:error
                            })
                        })
                }else{
                    res.json({
                        Error:"Cannot delete the designation as there are employees"
                    })
                }
            })
    }
}

module.exports = {
    addDesignation,
    index,
    deleteDesignation
}

