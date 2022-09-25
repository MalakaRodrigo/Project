const express = require('express')
const router = express.Router()
const Departments  = require('../models/departments')
const DepartmentsController = require('../controller/departmentsController')
const TaskController = require("../controller/taskController");

router.get('/',DepartmentsController.index)
router.post('/addDepartment',DepartmentsController.addDepartment)
router.post('/deleteDepartment',DepartmentsController.deleteDepartment)


router.get("/countDepartments", async (req, res) => {
    const allDepartments = await Departments.find().lean();
    let department_names = [];
    let count = [];
    allDepartments.forEach((Departments) => {
        department_names.push(Departments.department_name);
        count.push(Departments.employees.length);
        })
    const statusObject = {
        department_names,
        count
    };

    res.send(statusObject);
});


module.exports = router