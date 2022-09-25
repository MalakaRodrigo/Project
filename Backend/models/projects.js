const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema: ProjectSchema
const ProjectSchema = new Schema({
    name: { type: String, required: true, unique: true},
    members: { type: [{ type: String, required: true }] },
    projectStatus: { type: String, required: true},
    overdue: {type: Date, required: [true, 'Start date is required!'],},
    administrators: { type: [{ type: String, required: true }]},
    discription: {type: String, required: true},
    notes:{type: String, required: false}

})

//Document name: 'project'
module.exports = Project = mongoose.model('project',ProjectSchema);