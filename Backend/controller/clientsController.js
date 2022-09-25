const Clients = require('../models/clients')
const Project = require('../models/projects')
const Task = require("../models/task");
const Employee = require("../models/employee");
const Designations = require("../models/designations");
const Departments = require("../models/departments");

// *********************** Add a task ***************************
const addClient = (req, res) => {
    let client_name = req.body.client_name;
    let projects = req.body.projects;
    let email = req.body.email;

    // Check whether the employee is existing

    // Check whether the project is existing
    if (client_name == null || email == null) {
        res.json({
            message: "One or more of request paramaters are empty."
        })
    } else {

        let client = new Clients({
            clientName: client_name,
            projects: projects,
            email: email
        })

        client.save()
            .then(response => {
                res.json({
                    message: 'Successfully client was added.'
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    }
}

const addMeeting = (req, res) => {
    let client_id = req.body.client_id
    let date = req.body.date
    let venue = req.body.venue
    let description = req.body.description

    if (client_id == null || date == null || description==null) {
        res.json({
            message: "One or more of request paramaters are empty."
        })
    } else {

        Clients.findById(client_id)
            .then(result => {
                let temp = result.meetings
                temp.push({
                    date:date,
                    venue:venue,
                    description:description
                })
                let client = {
                    meetings: temp
                }
                Clients.findByIdAndUpdate(client_id, client)
                    .then(result2 => {
                        res.json({
                            message: "Successfully Added Meeting.",
                            Result: result2
                        })
                    })
                    .catch(error => {
                        res.json({error: error})
                    })
            })
    }
}

const addProject = (req, res) => {
    let client_id = req.body.client_id
    let project_id = req.body.project_id

    if (client_id == null || project_id== null) {
        res.json({
            message: "One or more of request paramaters are empty."
        })
    } else {

        Clients.findById(client_id)
            .then(result => {
                let temp = result.projects
                temp.push(project_id)
                let project = {
                    projects: temp
                }
                Clients.findByIdAndUpdate(client_id, project)
                    .then(result2 => {
                        res.json({
                            message: "Successfully Added Project",
                            Result: result2
                        })
                    })
                    .catch(error => {
                        res.json({error: error})
                    })
            })
    }
}


function getProject(projectId){
    return new Promise((resolve,reject) => {
        Project.findById(projectId,(err,pat) => {
            resolve(pat)
        })
    })
}

function getClient(client){
    return new Promise((resolve,reject) => {
        let projects = client.projects
        Promise.all(projects.map(projectId=> getProject(projectId)))
            .then(arr => {
                let temp = arr.filter(ele=>{
                    if(ele!=null){
                        return ele
                    }
                })
                resolve({
                    'Client':client,
                    'Projects':temp
                })
            })
    })
}

const getClients = (req, res, next) => {
    let clients = []
    Clients.find()
        .then(response => {
            Promise.all( response.map(client => getClient(client)))
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

const deleteClient = (req,res) => {
    let client_id = req.body.client_id
    if(client_id==null){
        res.json("Client Id is Null")
    }else{
        Clients.findByIdAndDelete(client_id)
            .then(result=>{
                res.json({message:"Successfully deleted the client",res:result})
            })
            .catch(error=>{
                res.json({message:"Failed deleting the client"})
            })
    }
}

module.exports = {
    addClient,
    addMeeting,
    getClients,
    addProject,
    deleteClient
}