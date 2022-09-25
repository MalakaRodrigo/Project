const { CalendarTaskBackLog } = require("../models/calendar");
const Employee = require("../models/employee");



//create method
const createCalendarTaskBlackLog = async (req, res) => {
    try {
        const calendertaskbacklog = await CalendarTaskBackLog.create({
            createdByID: req.params.id,
            calendarlog: {
                id: req.body.id,
                roomId: req.body.roomId,
                exDate: req.body.exDate,
                title: req.body.title,
                description: req.body.description,
                rRule: req.body.rRule,
                members: req.body.members,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                exDate: req.body.exDate
            },
        });
        calendertaskbacklog.save();
        res.json(calendertaskbacklog);
    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
};

//Fetch
const fetchCalendarTaskBlackLog = async (req, res) => {
    try {
        const calendertaskbacklog = await CalendarTaskBackLog.find({createdByID:req.params.id});
        res.json(calendertaskbacklog)
    } catch (error) {
        console.log("error while fetching");
        res.json(error.message);
    }
};
// / items: { $elemMatch: { id: req.params.id } } 

const fetchCalendarTaskBacklogOne = async (req, res) => {
    try {
        let myID = parseInt(req.params.id);
        const calendertaskbacklog = await CalendarTaskBackLog.findOne({ "calendarlog.id": myID }, { _id: 0, calendarlog: { $elemMatch: { id: myID } } });
        console.log("okay");
        res.json(calendertaskbacklog);
    } catch (error) {
        console.log("error while fetching asingle document.");
        res.json(error.message);
    }
};

const updateCalendarTaskBacklogOne = async (req, res) => {
    try {
        let myID = parseInt(req.params.id);
        const calendertaskbacklog = await CalendarTaskBackLog.updateOne({"createdByID":req.params.id2, "calendarlog.id": myID } , {$set: {
            calendarlog: {
                id: req.body.id,
                roomId: req.body.roomId,
                exDate: req.body.exDate,
                title: req.body.title,
                description: req.body.description,
                rRule: req.body.rRule,
                members: req.body.members,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                exDate: req.body.exDate
        }},
        },
            {
                new: true,
                runValidators: true
            }
        );
        console.log("okay");
        res.json(calendertaskbacklog);
    } catch (error) {
        console.log("error while updating Update");
        res.json(error);
    }
}

const deleteCalendarTaskBacklogOne = async (req, res) => {
    try {
        let myID = parseInt(req.params.id);
        let myID2 = parseInt(req.params.id2);
        console.log(myID2);
        const calendertaskbacklog = await CalendarTaskBackLog.deleteOne({"createdByID":req.params.id2, "calendarlog.id": myID });
        console.log("okay");
        console.log(req.params.id);
        res.json("");
    } catch (error) {
        console.log("oops");
        res.json(error.message);
    }
};//{ "calendarlog.id": myID }, { _id: 0, calendarlog: { $elemMatch: { id: myID } } }

const deleteCalendarTaskBacklog = async (req, res) => {
    try {
        let myID = (req.params.id);
        const calendertaskbacklog = await CalendarTaskBackLog.deleteMany({createdByID:myID});
        console.log("okay");
        console.log(req.params.id);
        res.json("");
    } catch (error) {
        console.log("oops");
        res.json(error.message);
    }
};

module.exports = {
    createCalendarTaskBlackLog,
    fetchCalendarTaskBlackLog,
    fetchCalendarTaskBacklogOne,
    updateCalendarTaskBacklogOne,
    deleteCalendarTaskBacklogOne,
    deleteCalendarTaskBacklog
    //fetchcurretuser,
};


//            startDate: {$gte:moment(req.query.start).toDate()},
//endDate: {$lte:moment(req.query.end).toDate()},

/*
        const currentuser =await Employee.findById(req.params.id);
        const updatecalendertaskbacklog = await CalendarTaskBackLog.findByIdAndUpdate(req.params.id,{
            createdBy:currentuser.createdBy,
        })
*/

