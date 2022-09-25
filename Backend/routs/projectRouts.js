const express = require("express");
const router = express.Router();

//Project model
const Project = require('../models/projects');
const Employee = require('../models/employee');
const TaskController = require("../controller/taskController");
const Task = require("../models/task");


// @route POST project/projects
// @desc displays about projects
// @access Public
router.post('/projects', (async (req, res) => {
    const { name, members, projectStatus, overdue, administrators, discription, notes } = req.body;
    //res.status(201).json({ msg: 'Projects'});

    //Check for existing user
    await Project.findOne({ name: req.body.name }).then(project => {
        if (project) return res.status(400).json({ msg: 'Project already exist' });

        const newProject = new Project({
            name,
            members,
            projectStatus,
            overdue,
            administrators,
            discription,
            notes
        });

        newProject.save()
            .then((project) => {
                console.log("Project added successfully!")
                res.json({
                    Project: {
                        name: project.name,
                        members: project.members,
                        projectStatus: project.projectStatus,
                        overdue: project.overdue,
                        administrators: project.administrators,
                        discription: project.discription,
                        notes: project.notes,
                    }
                });
            })
    })
})
);


// @route GET project/projects
// @desc displays about projects
// @access Public
router.get('/projects/:email', (req, res) => {
    let email = req.params.email;
    //Check for existing user
    Project.find({ members: email }).then(projects => {
        if (projects)
            return res.json(projects);
    })
});

// @route GET project/projects
// @desc displays about projects
// @access Public
router.get('/projects/projectsDetails:name', (req, res) => {
    let name = req.params.name;
    //Check for existing user
    Project.find({ name: name }).then(projects => {
        if (projects)
            return res.json(projects);
    })
});


//added by malaka
//to get project by its contributers
const fetchProjects = async (req, res) => {
    try {
        const projectlist = await Project.findOne({ name: req.params.id });
        res.json(projectlist)
    } catch (error) {
        res.json(error.message);
    }
};
router.get('/projects/list/:id', fetchProjects);

//added by malaka
const fetchallProjects = async (req, res) => {
    try {
        const projectlist = await Project.find({});
        res.json(projectlist)
        console.log("project get request success.");
    } catch (error) {
        console.log("project get request failed.");
        res.json(error.message);
    }
};
router.get('/projects', fetchallProjects);


const updateThisproject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate({ '_id': req.params.id }, {
            $set: {

                members: req.body.members,
                projectStatus: req.body.projectStatus,
                overdue: req.body.overdue,
                administrators: req.body.administrators,
                discription: req.body.discription,
            },
        },
            {
                new: true,
                runValidators: true
            });
        res.json(project)
        console.log(req.body.discription);
        console.log("project update success.");

    } catch (error) {
        console.log("project update failed.");
        res.json(error.message)
    }
}
router.put('/projectdetail/:id', updateThisproject);


const postProjectupdate = async (req, res) => {
    try {
        const projectlist = await Project.updateOne({ '_id': req.params.id }, {
            $set: {

                "projectStatus": req.body.projectStatus

            }
        });
        res.json(projectlist)
        console.log("project get request success.");
    } catch (error) {
        console.log("project get request failed.");
        res.json(error.message);
    }
};
router.post('/projectsstatus/:id', postProjectupdate);

const deleteProject = async (req, res) => {
    try {
        const projectlist = await Project.deleteOne({ '_id': req.params.id });
        res.json(projectlist)
        console.log("project delete request success.");
    } catch (error) {
        console.log("project delete request failed.");
        res.json(error.message);
    }
};
router.delete('/projectdelete/:id', deleteProject);


// ************************************** GET PROJECT BY ID *****************************************
const getProjectById = (req, res, next) => {
    if (req.body.project_id == null) {
        res.json({
            message: "The Project id is empty"
        })
    } else {
        Project.findById(req.body.project_id)
            .then(response => {
                res.json({
                    response
                })
            })
            .catch(error => {
                res.json({
                    message: 'An error occurred!'
                })
            })
    }
}
router.post('/projects/getProjectById', getProjectById)

router.get("/countProjects", async (req, res) => {
    const allProjects = await Project.find().lean();
    let pending = 0;
    let not_started = 0;
    let ongoing = 0;
    let completed = 0;
    let over_due = 0;
    allProjects.forEach((Project) => {
        switch (Project.projectStatus) {
            case "Pending":
                pending++;
                break;
            case "Not Started":
                not_started++;
                break;
            case "On going":
                ongoing++;
                break;
            case "Completed":
                completed++;
                break;
            case "Over due":
                over_due++;
                break;
            default:
                break;
        }
    });

    const statusObject = {
        pending,
        not_started,
        ongoing,
        completed,
        over_due,
    };

    res.send(statusObject);
});



router.get("/countProjects/:email", async (req, res) => {
    let email = req.params.email;
    const allProjects = await Project.find({ members: email }).lean();
    let pending = 0;
    let not_started = 0;
    let ongoing = 0;
    let completed = 0;
    let over_due = 0;
    allProjects.forEach((Project) => {
        switch (Project.projectStatus) {
            case "Pending":
                pending++;
                break;
            case "Not Started":
                not_started++;
                break;
            case "On going":
                ongoing++;
                break;
            case "Completed":
                completed++;
                break;
            case "Over due":
                over_due++;
                break;
            default:
                break;
        }
    });

    const statusObject = {
        pending,
        not_started,
        ongoing,
        completed,
        over_due,
    };

    res.send(statusObject);
})

module.exports = router;