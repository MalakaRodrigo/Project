const mongoose = require('mongoose');
const subcalendarTaskBackLogSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'ID is required!'], //just number type is used 9 quadtrilion entries
    },

    title: {
        type: String,
        required: [false, 'Title is required!'],
    },
    description: {
        type: String,
        required: [false, 'Description is required!'],
    },
    exDate: {
        type: String,
        required: [false, 'ExDate is required!'],
    },
    startDate: {
        type: Date, //must be Date
        required: [true, 'Start date is required!'],
    },

    endDate: {
        type: Date, 
        required: [true, 'End date is required!'],
    },
    roomId: {
        type: Number,
        required: [false, 'Room ID is required!'],
    },
    rRule: {
        type: String,
        required: [false, 'rRule is required!'],
    },
    members: {
        type: Array,
        required: [false, 'Members is required!'],
    },
})

const calendarTaskBackLogSchema = new mongoose.Schema({
    createdByID:{
        type: String,
        required: [true, 'created By is required' ],
    },
    calendarlog:{
        type:subcalendarTaskBackLogSchema
    }
},
    {
        timestamps: true,
    }
);

//Compile
const CalendarTaskBackLog = mongoose.model('CalendarTaskBackLog', calendarTaskBackLogSchema);
module.exports = { CalendarTaskBackLog };