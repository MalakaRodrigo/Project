const express = require('express');
const { createCalendarTaskBlackLog, fetchCalendarTaskBlackLog, fetchCalendarTaskBacklogOne, updateCalendarTaskBacklogOne, deleteCalendarTaskBacklogOne,deleteCalendarTaskBacklog} = require('../controller/calendarTaskBackLogControl');

const route =express.Router();


//create a new log - id- user database id saved in local when logged in
route.post('/calendarTaskBackLog/:id', createCalendarTaskBlackLog); 

//get all the logs related to logged in user -id- user database id saved in local when logged in
route.get('/calendarTaskBackLog/:id', fetchCalendarTaskBlackLog);

//get particular calendar log related to logged in user -id- calendar appointment id
route.get('/calendarTaskBackLog/:id', fetchCalendarTaskBacklogOne);

//update particular calendar log related to logged in user -id- calendar appointment id
route.put('/calendarTaskBackLog/:id/:id2', updateCalendarTaskBacklogOne);

//delete a particular calendar log related to logged in user -id- calendar appointment id id2- user database id saved in local when logged in
route.delete('/calendarTaskBackLog/:id/:id2', deleteCalendarTaskBacklogOne);

//delete all particular calendar logs related to logged in user -id- user database id saved in local when logged in
route.delete('/calendarTaskBackLogdelete/:id', deleteCalendarTaskBacklog);
//route.get('/employees/:id', fetchcurretuser);

module.exports ={route};