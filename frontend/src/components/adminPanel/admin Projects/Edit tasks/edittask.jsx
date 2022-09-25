import React from "react"; // react enviroment
import {
    Grid,
    Paper,
    Avatar,
    Typography,
    FormControl,
    FormControlLabel,
    TextField,
    Box,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import FormLabel from "@material-ui/core/FormLabel";
import axios from "axios";
//style class
import "../Admin project Home/loadingPage.css";
import "./edittaskStyles.css";

import { Helmet } from 'react-helmet'

const TITLE = 'Create Task'
//style classes
const paperStyle = {
    padding: "50px 20px",
    width: "700px",
    margin: "20px auto",
    backgroundColor: "#425e6e",
    opacity: 0.8,
};
const avatarStyle = {
    backgroundColor: "black",
};
const radioStyle = {
    backgroundColor: "#425e6e",
    opacity: 0.8,
};


//React class for creating a task
export default class Edittask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editId: this.props.id,
            selectedValue: 0,
            selectedProject: '',
            taskData: [],
            taskname: "",
            endDate: Date.now(),
            taskstatus: "To Do",
            description: "",

            missingdata: false,
            submitted: false,

        };
    }

    componentWillMount() {
        this.getProjecLogs();
    }


    //data fetching
    getProjecLogs = () => {
        axios
            .post("http://localhost:8070/task/getTaskById", { task_id: this.state.editId })
            .then((response) => {
                let data = response.data.response;
                this.setState({
                    description: data.action,
                    taskname: data.task_name,
                    selectedProject: data.project_name,
                    endDate: data.due_date,
                    taskstatus:data.task_status,
                    taskData: data
                })
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    };




    //set selected task name of current state
    setTaskname = (event) => {
        var value = event.target.value;
        this.setState({
            taskname: value,
        });
    };

    //set selected task status of current state
    setCategory = (event) => {
        var value = event.target.value;
        this.setState({
            taskstatus: value,
        });
    };

    //setselected end date of current state
    setendDate = (date) => {
        this.setState({
            endDate: date,
        });
    };

    //set added description of current state
    setdescription = (event) => {
        var value = event.target.value;
        this.setState({
            description: value,
        });
    };

    //submit click of the form
    handleClick = (event) => {
        //end of getting data


        //checking for invalid
        if (
            this.state.taskname === "" ||
            this.state.endDate.toString() === "" ||
            this.state.taskstatus === "" ||
            this.state.description === ""
        ) {
            this.setState({
                missingdata: true,
                submitted: false,
            });
        } else {
            this.setState({
                missingdata: false,
                submitted: true,
            });
        }


        if (!this.state.missingdata) {
            let taskBody = [
                {
                    task_id: this.state.taskData._id,
                    task_name: this.state.taskname,
                    due_date: this.state.endDate,
                    action: this.state.description,
                    task_status: this.state.taskstatus,
                    project_id: this.state.taskData.project_id, //
                    project_name: this.state.taskData.project_name, //
                    assigned_to: this.state.taskData.assigned_to,
                },
            ];

            axios
                .post("http://localhost:8070/task/update", taskBody[0])
                .then((response) => {
                })
                .catch((error) => {
                    alert("error");
                });

        }
    };


    clearForm = (event) => {
        this.setState({
            selectedValue: 0,
            taskname: "",
            endDate: Date.now(),
            taskstatus: "To Do",
            description: "",
            count: 0,
            showgrid: false,
            showerror: false,
            showend: false,
            missingdata: false,
            showcustomoption: true,
            submitted: false,

        })
    }


    //render to web page
    render() {
        const {
            selectedProject,
            taskname,
            taskstatus,
            endDate,
            description,
            missingdata,
            submitted,
        } = this.state;

        //if data didnt recieve loading is true and this will render

        return (
            <div>
                <Helmet>
                    <title>{TITLE}</title>
                </Helmet>
                <div>
                    <form>
                        <div>
                            <Grid>
                                <Paper elevation={20} style={paperStyle}>
                                    {!submitted ?
                                        <div>
                                            <button type="button" class="buttonsubmitclear" onClick={this.clearForm}>C L E A R</button>
                                        </div> : null
                                    }
                                    <a href="http://localhost:3000/projects#">
                                        <button class="closebuttonactualproject">
                                            C L O S E
                                        </button>
                                    </a>

                                    <Grid align="left">
                                        <div>
                                            <Avatar style={avatarStyle}>
                                                <AddCircleOutlineOutlinedIcon
                                                    fontSize="large"
                                                    htmlColor="#ffffff"
                                                />
                                            </Avatar>
                                        </div>

                                        <h1 style={{color:'white'}}>EDIT TASKS</h1>

                                        {!submitted || !missingdata ?
                                            <Typography variant="caption">
                                                <p>
                                                    Please use this form to edit tasks deadline
                                                    <br />
                                                </p> </Typography> : null
                                        }


                                    </Grid>
                                    <Grid>

                                        {missingdata ? (
                                            <div>
                                                Reqired Data is missing.<br />
                                                Update failed.
                                                <br />
                                            </div>
                                        ) : null}
                                        {submitted ? (
                                            <div>
                                                Task Edited Successfully
                                                <br />
                                            </div>
                                        ) : null}


                                    </Grid>

                                    {!submitted ?
                                        <div>
                                            <Grid>
                                                <TextField label="Project Name" value={selectedProject} disabled={true}></TextField>
                                                <TextField
                                                    value={taskname}
                                                    fullWidth
                                                    label="Task Name"
                                                    onChange={this.setTaskname}
                                                ></TextField>
                                            </Grid>
                                            <FormControl class="marginedit">
                                                <FormLabel>Task Status</FormLabel>
                                                <RadioGroup
                                                    style={radioStyle}
                                                    color="primary"
                                                    row
                                                    value={taskstatus}
                                                    onChange={this.setCategory}
                                                >
                                                    <FormControlLabel
                                                        value="To Do"
                                                        control={<Radio />}
                                                        label="To Do"
                                                    />
                                                    <FormControlLabel
                                                        value="In Progress"
                                                        control={<Radio />}
                                                        label="In Progress"
                                                    />
                                                    <FormControlLabel
                                                        value="Done"
                                                        control={<Radio />}
                                                        label="Done"
                                                    />
                                                    <FormControlLabel
                                                        value="Bugs/Issues"
                                                        control={<Radio />}
                                                        label="Bugs/Issues"
                                                    />
                                                    <FormControlLabel
                                                        value="Review"
                                                        control={<Radio />}
                                                        label="Review"
                                                    />
                                                    <FormControlLabel
                                                        value="Overdue"
                                                        control={<Radio />}
                                                        label="Overdue"
                                                    />
                                                </RadioGroup>
                                            </FormControl>

                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    variant="inline"
                                                    inputVarient="outlined"
                                                    label="End Date"
                                                    value={endDate}
                                                    formate="MM/dd/yyy"
                                                    onChange={this.setendDate}
                                                ></KeyboardDatePicker>
                                            </MuiPickersUtilsProvider>

                                            <Box
                                                component="form"
                                                sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
                                                noValidate
                                                autoComplete="off"
                                            >
                                                <div>
                                                    <TextField
                                                        fullWidth
                                                        label="Task Description"
                                                        id="outlined-multiline-flexible"
                                                        value={description}
                                                        multiline
                                                        maxRows={4}
                                                        onChange={this.setdescription}
                                                    />
                                                </div>
                                            </Box>
                                            <div class="containerbuttons">

                                                <button
                                                    class="buttonsubmittask"
                                                    type="button"
                                                    varient="contained"
                                                    color="primary"
                                                    onClick={this.handleClick}
                                                >
                                                    <span color="primary">SUBMIT</span>
                                                </button>

                                            </div>
                                        </div>

                                        : null

                                    }



                                </Paper>
                            </Grid>
                        </div>
                    </form>
                </div>


            </div>
        );
    }
} //end of class
