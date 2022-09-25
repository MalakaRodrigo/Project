const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toString() + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 500},
    fileFilter: fileFilter

});

//Employee model
const Employee = require('../models/employee');
const TaskController = require("../controller/taskController");
const Task = require("../models/task");
const Departments = require('../models/departments');
const Designations = require('../models/designations');

// @route POST employee/register
// @desc Register employee
// @access Public
router.post('/register', upload.single('profileImage'), (req, res) => {
    const {name, email, position, password, role, department, designation} = req.body;

    //Validation
    if (!name || !email || !position || !password || !role) {
        return res.status(400).json({msg: 'Please enter all fields'});
    }

    //Check for existing user
    Employee.findOne({email: req.body.email}).then(employee => {
        if (employee) return res.status(400).json({msg: 'User already exist'});

        let profilePath = ''
        if (req.file == null) {
            profilePath = 'uploads/avatar.jpeg'
        } else {
            profilePath = req.file.path
        }
        const newEmplyee = new Employee({
            name,
            email,
            position,
            password,
            role,
            department,
            designation,
            profileImage: profilePath
        });

        //Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newEmplyee.password, salt, (err, hash) => {
                if (err) throw err;
                newEmplyee.password = hash;
                newEmplyee.save()
                    .then(employee => {
                        //Giving the output
                        console.log("Registration succeed!");
                        if (department == "" || department == null) {
                            // Add the employee to desination
                            Designations.findById(designation)
                                .then(result3 => {
                                    let employeesOfDesignation = result3.employees
                                    employeesOfDesignation.push(employee._id)
                                    let updatedDesignation = {
                                        employees: employeesOfDesignation
                                    }
                                    Designations.findByIdAndUpdate(designation, updatedDesignation)
                                        .then(result4 => {
                                            //Verify user by jwt
                                            jwt.sign(
                                                {id: employee.id},
                                                config.get('jwtSecret'),
                                                {expiresIn: 7200},
                                                (err, token) => {
                                                    if (err) throw err;
                                                    res.json({
                                                        token,
                                                        employee: {
                                                            id: employee.id,
                                                            name: employee.name,
                                                            email: employee.email,
                                                            position: employee.position,
                                                            role: employee.role,
                                                            department: employee.department,
                                                            designation: employee.designation,
                                                            profileImage: employee.profileImage
                                                        }
                                                    });
                                                }
                                            )
                                        })
                                        .catch(error => {
                                            res.json(error)
                                        })
                                })
                                .catch(error => {
                                    res.json(error)
                                })
                        } else {
                            //Add the employee to department
                            Departments.findById(department)
                                .then(result => {
                                    let employees = result.employees
                                    employees.push(employee._id)

                                    let updatedDepartment = {
                                        employees: employees
                                    }
                                    Departments.findByIdAndUpdate(department, updatedDepartment)
                                        .then(result2 => {

                                            // Add the employee to desination
                                            Designations.findById(designation)
                                                .then(result3 => {
                                                    let employeesOfDesignation = result3.employees
                                                    employeesOfDesignation.push(employee._id)
                                                    let updatedDesignation = {
                                                        employees: employeesOfDesignation
                                                    }
                                                    Designations.findByIdAndUpdate(designation, updatedDesignation)
                                                        .then(result4 => {
                                                            //Verify user by jwt
                                                            jwt.sign(
                                                                {id: employee.id},
                                                                config.get('jwtSecret'),
                                                                {expiresIn: 7200},
                                                                (err, token) => {
                                                                    if (err) throw err;
                                                                    res.json({
                                                                        token,
                                                                        employee: {
                                                                            id: employee.id,
                                                                            name: employee.name,
                                                                            email: employee.email,
                                                                            position: employee.position,
                                                                            role: employee.role,
                                                                            department: employee.department,
                                                                            designation: employee.designation,
                                                                            profileImage: employee.profileImage
                                                                        }
                                                                    });
                                                                }
                                                            )
                                                        })
                                                        .catch(error => {
                                                            res.json(error)
                                                        })
                                                })
                                                .catch(error => {
                                                    res.json(error)
                                                })
                                        })
                                        .catch(error => {
                                            res.json(error)
                                        })
                                })
                                .catch(error => {
                                    res.json
                                })
                        }
                    })
            })
        })
    })
});

// @route POST employee/auth
// @desc Authenticate the employee
// @access Public
router.post('/auth', (req, res) => {
    const {email, password} = req.body;

    //Validation
    if (!email || !password) {
        return res.status(400).json({msg: 'Please enter all fields'});
    }

    //Check for existing user
    Employee.findOne({email: req.body.email}).then(employee => {
        if (!employee) return res.status(400).json({msg: 'User does not exist'});

        //Validating password
        bcrypt.compare(password, employee.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({msg: 'Invalid credintials'});

                //Verify user by jwt
                jwt.sign(
                    {id: employee.id},
                    config.get('jwtSecret'),
                    {expiresIn: 7200},
                    (err, token) => {
                        if (err) throw err;
                        console.log("User logged in!");
                        res.json({
                            token,
                            employee: {
                                id: employee.id,
                                name: employee.name,
                                email: employee.email,
                                position: employee.position,
                                role: employee.role,
                                profileImage: employee.profileImage,
                                designation:employee.designation,
                                department:employee.department,
                                notes:employee.notes
                            }
                        });
                    }
                )

            })
    })
});

router.get('/user/:email', (req, res) => {
    let user = req.params.email;
    console.log(user)
    Employee.find({email: user}).then(user => {
        if (user)
            return res.json(user);

    })
});

router.get('/allEmployees', (req, res) => {
    Employee.find({role: 0}).then(employees => {
        return res.json(employees);
    })
});

router.get('/departmentEmployees/:dep_id', (req, res) => {
    let dep_id = req.params.dep_id;
    Employee.find({department: dep_id}).then(employees => {
        if (employees)
            return res.json(employees);
    })
});

const deleteEmployee = (req, res) => {
    if (req.body.employee_id == null) {
        res.json({
            message: "Employee Id is empty"
        })
    } else {
        Employee.findById(req.body.employee_id)
            .then(result => {
                if (!result) {
                    return res.status(400).json({msg: 'Employee does not exist'});
                } else {
                    Employee.findByIdAndDelete(req.body.employee_id)
                        .then(response => {
                            if (response.department != "" && response.department != null) {
                                Departments.findById(response.department)
                                    .then(result => {
                                        let temDeps = result.employees
                                        let letRemEmployee = temDeps.filter(val => {
                                            if (val != req.body.employee_id) {
                                                return val
                                            }
                                        })
                                        Departments.findByIdAndUpdate(response.department, {employees: letRemEmployee})
                                            .then(result2 => {
                                                console.log("Deleting employee department updated")
                                                Designations.findById(response.designation)
                                                    .then(result3 => {
                                                        let temDes = result3.employees
                                                        let remTemDes = temDes.filter(val => {
                                                            if (val != req.body.employee_id) {
                                                                return val
                                                            }
                                                        })
                                                        Designations.findByIdAndUpdate(response.designation, {employees: remTemDes})
                                                            .then(result4 => {
                                                                res.json({
                                                                    response
                                                                })
                                                            }).catch(error => {
                                                            res.json(error)
                                                        })
                                                    }).catch(error => {
                                                    res.json(error)
                                                })
                                            }).catch(error => {
                                            res.json(error)
                                        })
                                    }).catch(error => {
                                    res.json(error)
                                })
                            } else {
                                Designations.findById(response.designation)
                                    .then(result3 => {
                                        let temDes = result3.employees
                                        let remTemDes = temDes.filter(val => {
                                            if (val != req.body.employee_id) {
                                                return val
                                            }
                                        })
                                        Designations.findByIdAndUpdate(response.designation, {employees: remTemDes})
                                            .then(result4 => {
                                                res.json({
                                                    response
                                                })
                                            }).catch(error => {
                                            res.json(error)
                                        })
                                    }).catch(error => {
                                    res.json(error)
                                })
                            }
                        })
                        .catch(error => {
                            res.json({
                                message: 'An error occurred!'
                            })
                        })
                }
            })
    }
}
router.post('/deleteEmployee', deleteEmployee)

// ******************** Update a Password By Admin ***************************
const updatePasswordByAdmin = (req, res) => {
    let employee_id = req.body.employee_id;
    let newPassword = req.body.new_password;

    if (employee_id == null || newPassword == null) {
        res.json({
            message: "Employee Id Is Empty."
        })
    } else {
        let updated_employee = {
            password: newPassword
        }
        Employee.findById(employee_id)
            .then(result => {
                if (!result) {
                    return res.status(400).json({msg: 'Employee does not exist'});
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(updated_employee.password, salt, (err, hash) => {
                            if (err) throw err;
                            updated_employee.password = hash;
                            Employee.findByIdAndUpdate(employee_id, updated_employee)
                                .then(employee => {
                                    //Giving the output
                                    console.log("Updating password is succeed!");
                                    res.json({
                                        employee: {
                                            id: employee.id,
                                            name: employee.name,
                                            email: employee.email,
                                            position: employee.position,
                                            role: employee.role,
                                            department: employee.department,
                                            designation: employee.designation,
                                            profileImage: employee.profileImage
                                        }
                                    });
                                })
                                .catch(error => {
                                    res.json({
                                        message: 'An error occurred!'
                                    })
                                })
                        })
                    })
                }
            })
            .catch(error => {
                res.json({
                    message: 'An error occurred!'
                })
            })
    }
}
router.post('/updatePasswordAdmin', updatePasswordByAdmin)

// ******************** Update a Password By Employee ***************************
const updatePasswordByEmployee = (req, res) => {
    let employee_id = req.body.employee_id;
    let oldPassword = req.body.old_password;
    let newPassword = req.body.new_password;

    if (employee_id == null || oldPassword == null || newPassword == null) {
        res.json({
            message: "Employee Id Is Empty."
        })
    } else {
        let updated_employee = {
            password: newPassword
        }
        Employee.findById(employee_id)
            .then(result => {
                if (!result) {
                    return res.status(400).json({msg: 'Employee does not exist'});
                } else {
                    bcrypt.compare(oldPassword, result.password)
                        .then(isMatch => {
                            if (!isMatch)
                                return res.status(400).json({msg: 'Invalid old password'});
                            else {
                                //Create salt & hash
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(updated_employee.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        updated_employee.password = hash;
                                        Employee.findByIdAndUpdate(employee_id, updated_employee)
                                            .then(employee => {
                                                //Giving the output
                                                console.log("Updating password is succeed!");
                                                res.json({
                                                    employee: {
                                                        id: employee.id,
                                                        name: employee.name,
                                                        email: employee.email,
                                                        position: employee.position,
                                                        role: employee.role,
                                                        department: employee.department,
                                                        designation: employee.designation,
                                                        profileImage: employee.profileImage
                                                    }
                                                });
                                            })
                                            .catch(error => {
                                                res.json({
                                                    message: 'An error occurred!'
                                                })
                                            })
                                    })
                                })

                            }
                        })
                }
            })
            .catch(error => {
                res.json({
                    message: 'An error occurred!'
                })
            })
    }
}
router.post('/updatePasswordEmployee', updatePasswordByEmployee)

// ******************** Update a Profile Pic By Employee ***************************
router.post('/uploadProfileImage', upload.single('profileImage'), (req, res) => {
    let employee_id = req.body.employee_id;
    Employee.findById(employee_id)
        .then(result => {
            if (!result) {
                res.json({
                    message: "No employee existing with the id!"
                })
            } else {
                let profilePath = ''
                if (req.file == null) {
                    profilePath = 'uploads/avatar.jpeg'
                } else {
                    profilePath = req.file.path
                }
                const updatedEmployee = {
                    profileImage: profilePath
                }

                Employee.findByIdAndUpdate(employee_id, updatedEmployee)
                    .then(result2 => {
                        Employee.findById(employee_id)
                            .then(result3 => {
                                res.json({
                                    message: "Successfully Updated Profile Image",
                                    newImage: result3.profileImage
                                })
                            })
                            .catch(error => {
                                res.json(error)
                            })
                    })
                    .catch(error => {
                        res.json(error)
                    })
            }
        })
        .catch(error => {
            res.json(error)
        })
})

// ******************** Update a Position By Admin ***************************
const updatePositionByAdmin = (req, res) => {
    let employee_id = req.body.employee_id;

    let designation = req.body.designation;
    let department = req.body.department;
    let position = req.body.position;

    if (employee_id == null || department == null || designation == null || position == null) {
        res.json({
            message: "One of Parameters Is Empty."
        })
    } else {
        let updated_employee = {
            designation: designation,
            department: department,
            position: position
        }
        Employee.findById(employee_id)
            .then(result => {
                if (!result) {
                    return res.status(400).json({msg: 'Employee does not exist'});
                } else {
                    Employee.findByIdAndUpdate(employee_id, updated_employee)
                        .then(employee => {
                            //Giving the output
                            console.log("Updating position is succeed!");
                            // Update employee in department
                            Departments.findById(department)
                                .then(departmentFromDB => {
                                    let employeesFromDB = departmentFromDB.employees
                                    employeesFromDB.push(employee_id)
                                    let updatedDepartment = {
                                        employees: employeesFromDB
                                    }
                                    Departments.findByIdAndUpdate(department, updatedDepartment)
                                        .then(result2 => {
                                            // Delete the employee from previous department
                                            Departments.findById(employee.department)
                                                .then(previousDepartment => {
                                                    let employeesFromPreviousDepartment = previousDepartment.employees
                                                    let employeesOfDepAfterRemoving =
                                                        employeesFromPreviousDepartment.filter(element => {
                                                            if (element != employee_id) {
                                                                return element
                                                            }
                                                        })
                                                    let updatedPrevDepartment = {employees: employeesOfDepAfterRemoving}
                                                    Departments.findByIdAndUpdate(employee.department, updatedPrevDepartment)
                                                        .then(result3 => {
                                                            // Update the new designation with employee
                                                            Designations.findById(designation)
                                                                .then(designationFromDB => {
                                                                    let employeesOfDesignation = designationFromDB.employees
                                                                    employeesOfDesignation.push(employee_id)
                                                                    let updatedDesignation = {
                                                                        employees: employeesOfDesignation
                                                                    }
                                                                    Designations.findByIdAndUpdate(designation, updatedDesignation)
                                                                        .then(result4 => {
                                                                            // Remove employee from previous designation
                                                                            Designations.findById(employee.designation)
                                                                                .then(previousDesignation => {
                                                                                    let empFromPreDes = previousDesignation.employees
                                                                                    let empOfDesAfterRemov =
                                                                                        empFromPreDes.filter(element => {
                                                                                            if (element != employee_id) {
                                                                                                return element
                                                                                            }
                                                                                        })
                                                                                    let updatedPrevDes = {employees: empOfDesAfterRemov}
                                                                                    Designations.findByIdAndUpdate(employee.designation, updatedPrevDes)
                                                                                        .then(result5 => {
                                                                                            res.json({
                                                                                                employee: {
                                                                                                    id: employee.id,
                                                                                                    name: employee.name,
                                                                                                    email: employee.email,
                                                                                                    position: employee.position,
                                                                                                    role: employee.role,
                                                                                                    department: employee.department,
                                                                                                    designation: employee.designation,
                                                                                                    profileImage: employee.profileImage
                                                                                                }
                                                                                            });
                                                                                        })
                                                                                        .catch(error => {
                                                                                            res.json(error)
                                                                                        })
                                                                                })
                                                                                .catch(error => {
                                                                                    res.json(error)
                                                                                })
                                                                        })
                                                                })
                                                        })
                                                        .catch(error => {
                                                            res.json(error)
                                                        })
                                                })
                                                .catch(error => {
                                                    res.json(error)
                                                })
                                        })
                                        .catch(error => {
                                            res.json(error)
                                        })
                                })
                                .catch(error => {
                                    res.json(error)
                                })
                        })
                        .catch(error => {
                            res.json({
                                message: 'An error occurred!'
                            })
                        })
                }
            })
            .catch(error => {
                res.json({
                    message: 'An error occurred!'
                })
            })
    }
}
router.post('/updatePositionAdmin', updatePositionByAdmin)

module.exports = router;