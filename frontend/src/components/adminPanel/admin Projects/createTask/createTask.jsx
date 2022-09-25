import React from "react"; // react enviroment
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
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
import "./createtaskStyles.css";

import { Helmet } from 'react-helmet'

const TITLE = 'Create Task'
//style classes
const paperStyle = {
  padding: "50px 20px",
  width: "80%",
  marginTop:"5%",
  margin: "20px auto",
  backgroundColor: "#2f3640",
  opacity: 0.8,
};
const avatarStyle = {
  backgroundColor: "black",
};
const radioStyle = {
  backgroundColor: "#2f3640",
  opacity: 0.8,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

//React class for creating a task
export default class Createtask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error:"",
      employees: [],
      projects: [],
      selectedValue: 0,
      selectedProject: [],
      projectContributers: [],
      taskname: "",
      endDate: Date.now(),
      taskstatus: "To Do",
      description: "",
      count: 0,
      taskDetail: [],
      customValue: "",
      customView: false,
      loading: false,
      showgrid: false,
      showerror: false,
      showend: false,
      showsubmit: false,
      missingdata: false,
      showcustomoption: true,
      submitted: false,
    };
  }

  componentDidMount() {
    this.getProjecLogs();
  }


  //data fetching
  getProjecLogs = () => {
    var resources = [];
    axios
      .get("http://localhost:8070/projects")
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          const project = [
            {
              id: response.data[i]._id,
              name: response.data[i].name,
              members: response.data[i].members,
              projectStatus: response.data[i].projectStatus,
              overdue: response.data[i].overdue,
              administrators: response.data[i].administrators,
              discription: response.data[i].discription,
            },
          ];
          resources.push(project[0]);
        }

        this.setState({
          projects: resources,
        });
      })
      .catch(() => {
        this.setState({
          error: true,
        });
      });
  };

  //set selected project
  setSelectedProject = (event) => {
    var value = event.target.value;
    for (var i = 0; i < this.state.projects.length; i++) {
      if (value === this.state.projects[i].name) {
        var selected = [];
        selected.push(this.state.projects[i]);
        this.setState({
          selectedProject: selected,
          projectContributers: this.state.projects[i].members,
          taskname: "",
        });
      }
    }

    this.setState({
      showgrid: true,
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
    if (this.state.customView) {
      var temp_task = this.state.taskDetail;
      var temp = [
        {
          taskname: this.state.taskname,
          endDate: this.state.endDate,
          taskstatus: this.state.taskstatus,
          description: this.state.description,
        },
      ];
      temp_task.push(temp[0]);
      this.setState({
        taskDetail: temp_task,
      });
    } //end of getting data


    //checking for invalid
    for (var i = 0; i < this.state.taskDetail.length; i++) {
      if (
        this.state.taskDetail[i].taskname === "" ||
        this.state.taskDetail[i].endDate.toString() === "" ||
        this.state.taskDetail[i].taskstatus === "" ||
        this.state.taskDetail[i].description === ""
      ) {
        this.setState({
          missingdata: true,
          submitted: false,
        });
        break;
      } else {
        this.setState({
          missingdata: false,
          submitted: true,
        });
      }
    }


    axios.get('http://localhost:8070/employee/allEmployees')
      .then((response) => {
        let IDarray = response.data
        var saveIndex = []
        for (let j = 0; j < IDarray.length; j++) {
          for (let k = 0; k < this.state.projectContributers.length; k++) {
            if (this.state.projectContributers[k] === IDarray[j].email) {
              saveIndex.push(IDarray[j]._id)
            }
          }
        }

        if (!this.state.customView && !this.state.missingdata) {
          for (let i = 0; i < this.state.taskDetail.length; i++) {
            let contributor = [saveIndex[i]];
            let taskBody = [
              {
                task_name: this.state.taskDetail[i].taskname,
                due_date: this.state.taskDetail[i].endDate,
                action: this.state.taskDetail[i].description,
                task_status: this.state.taskDetail[i].taskstatus, //
                project_id: this.state.selectedProject[0].id, //
                project_name: this.state.selectedProject[0].name, //
                assigned_to: contributor,
              },
            ];

            axios
              .post("http://localhost:8070/task/addTask", taskBody[0])
              .then((response) => {
              })
              .catch((error) => {
                alert("error");
              });
          }
        } else if (!this.state.missingdata) {
          for (let i = 0; i < this.state.taskDetail.length; i++) {
            let taskBody = [
              {
                task_name: this.state.taskDetail[i].taskname,
                due_date: this.state.taskDetail[i].endDate,
                action: this.state.taskDetail[i].description,
                task_status: this.state.taskDetail[i].taskstatus, //
                project_id: this.state.selectedProject[0].id, //
                project_name: this.state.selectedProject[0].name, //
                assigned_to: saveIndex,
              },
            ];

            axios
              .post("http://localhost:8070/task/addTask", taskBody[0])
              .then((response) => {
              })
              .catch((error) => {
                alert("error");
              });
          }
        }


        //updating the project status accordigly
        //show project fuction will working together
        if (!this.state.missingdata) {
          var ProjecTStat = "-";
          let Completed = false;
          for (let y = 0; y < this.state.taskDetail.length; y++) {
            if (
              this.state.taskDetail[y].taskstatus === "To Do" ||
              this.state.taskDetail[y].taskstatus === "In Progress" ||
              this.state.taskDetail[y].taskstatus === "Bugs/Issues"
            ) {
              ProjecTStat = "On going";
              break;
            } else if (
              this.state.taskDetail[y].taskstatus === "Review" ||
              this.state.taskDetail[y].taskstatus === "Done"
            ) {
              ProjecTStat = "Completed";
              Completed = true;
            } else if (!Completed) {
              ProjecTStat = "Overdue";
            }
          }
          let sendData = { projectStatus: ProjecTStat };

          axios
            .post(
              "http://localhost:8070/projectsstatus/" +
              this.state.selectedProject[0].id,
              sendData
            )
            .then((response) => {
            });
        }



      }).catch((error) => {
        console.log(error)
      })

  };



  //going back in form
  handleBack = (event) => {
    //going back in task form
    var currentpage = this.state.count; //current page index starting from zero

    //copying current data to tempory array
    var temp_task = [];
    temp_task = this.state.taskDetail;

    //saving current page data to tempory variable
    var temp = [
      {
        taskname: this.state.taskname,
        endDate: this.state.endDate,
        taskstatus: this.state.taskstatus,
        description: this.state.description,
      },
    ];

    //setting count to previous page if not in first page
    if (currentpage > 0) {
      //overwrite page data to current page
      temp_task[currentpage] = temp[0];

      //move to previos page
      currentpage = currentpage - 1;
      this.setState({
        count: currentpage,
      });
    } else {
      //overwrite page data to current page
      temp_task[currentpage] = temp[0];
    }

    this.setState({
      taskDetail: temp_task,
    });

    //setting intial data of rendering page
    this.setState({
      taskname: this.state.taskDetail[currentpage].taskname,
      endDate: this.state.taskDetail[currentpage].endDate,
      taskstatus: this.state.taskDetail[currentpage].taskstatus,
      description: this.state.taskDetail[currentpage].description,
    });
  };

  //going forward in form
  handleNext = (event) => {
    //going forward in task form
    var currentpage = this.state.count; //current page index starting from zero
    var temp_task = [];
    temp_task = this.state.taskDetail;

    var temp = [
      {
        taskname: this.state.taskname,
        endDate: this.state.endDate,
        taskstatus: this.state.taskstatus,
        description: this.state.description,
      },
    ];

    temp_task[currentpage] = temp[0];

    currentpage = currentpage + 1;

    this.setState({
      taskDetail: temp_task,
    });

    //end form if end of employees
    if (currentpage >= this.state.projectContributers.length) {
      this.setState({
        showend: true,
        showsubmit: true,
      });
    } else if (this.state.taskDetail.length === currentpage) {
      this.setState({
        taskname: "",
        endDate: Date.now(),
        taskstatus: "To Do",
        description: "",
      });
    } else {
      this.setState({
        taskname: this.state.taskDetail[currentpage].taskname,
        endDate: this.state.taskDetail[currentpage].endDate,
        taskstatus: this.state.taskDetail[currentpage].taskstatus,
        description: this.state.taskDetail[currentpage].description,
      });
    }

    this.setState({
      count: currentpage,
    });
  };

  // set the customers selection of method of creating tasks
  setModel = (event) => {
    var value = event.target.value;
    this.setState({
      customValue: value,
    });
    if (value === "Custom") {
      this.setState({
        customView: true,
      });
    } else {
      this.setState({
        customView: false,
      });
    }
  };


  clearForm = (event) => {
    this.setState({
      selectedValue: 0,
      selectedProject: [],
      taskname: "",
      endDate: Date.now(),
      taskstatus: "To Do",
      description: "",
      count: 0,
      customValue: "",
      customView: false,
      loading: false,
      showgrid: false,
      showerror: false,
      showend: false,
      showsubmit: false,
      missingdata: false,
      showcustomoption: true,
      submitted: false,

    })
  }


  //render to web page
  render() {
    const {
      projects,
      selectedProject,
      projectContributers,
      taskname,
      taskstatus,
      endDate,
      description,
      count,
      showgrid,
      showerror,
      showend,
      showsubmit,
      showcustomoption,
      customValue,
      customView,
      missingdata,
      submitted,
    } = this.state;

    //if data didnt recieve loading is true and this will render
    if (this.state.loading) {
      return (
        <div>
          <div class="ring1">
            Loading
            <span class="span1"></span>
          </div>
          <div>
            <button class="loadingbutton">
              Please check your network connection.
            </button>
          </div>
        </div>
      );
    }

    if (this.state.missingdata) {
      <div>Missing Data</div>;
    }

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
                 
               

                  <Grid align="left">
                  
                    <div>
                    <div style={{marginLeft:"90%"}}>
                  {!submitted || this.state.error ?
                    <button
                      class="buttonsubmitclearproject" type='button' onClick={this.clearForm}>
                      C L E A R
                    </button> : null
                  }


                  {/* <a href="http://localhost:3000/projects#">
                    <button class="closebuttonactualproject">
                      C L O S E
                    </button>
                  </a> */}
                </div>
                      <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon
                          fontSize="large"
                          htmlColor="#ffffff"
                        />
                      </Avatar>
                    </div>

                    <h1 style={{color:'white'}}>MANAGE TASKS</h1>
                    <Typography variant="caption">
                      {!submitted ?
                        <p style={{color:'white'}}>
                          Please use this form to create tasks
                          <br />
                          All fields are required.
                        </p> : null}

                    </Typography>
                  </Grid>
                  <Grid>
                    {!showgrid ? (
                      <FormControl fullWidth label="" minWidth="300px">
                        <InputLabel style={{color:'#a4b0be'}}>Project List</InputLabel>
                        <Select
                          value={selectedProject.name}
                          MenuProps={MenuProps}
                          onChange={this.setSelectedProject}
                        >
                          {projects.map((selproject, index) => (
                            <MenuItem key={index} value={selproject.name}>
                              {selproject.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : null}

                    {missingdata ? (
                      <div style={{color:'white'}}>
                        Reqired Data is missing.
                        <br />
                      </div>
                    ) : null}
                    {submitted ? (
                      <div style={{color:'white'}}>
                        Task Added Successfully
                        <br />
                      </div>
                    ) : null}
                    {showcustomoption && !showgrid ? (
                      <FormControl class="marginedit">
                        <FormLabel style={{color:'white'}}>Method you need to follow</FormLabel>
                        <RadioGroup
                          style={radioStyle}
                          color="primary"
                          row
                          value={customValue}
                          onChange={this.setModel}
                        >
                          <FormControlLabel style={{color:'white'}}
                            value="Custom"
                            control={<Radio />}
                            label="Same task for all employees"
                          />
                          <FormControlLabel style={{color:'white'}}
                            value="Unique"
                            control={<Radio />}
                            label="Unique task for each employee"
                          />
                        </RadioGroup>
                      </FormControl>
                    ) : null}

                    <div></div>
                  </Grid>
                  {showerror && showgrid && !missingdata ? (
                    <div>
                      <br />
                      <p>No contributers for this project.</p>
                    </div>
                  ) : null}

                  {showend && showgrid && !missingdata && !showsubmit ? (
                    <div>
                      <br />
                      <p>No more contributers for this project.</p>
                    </div>
                  ) : null}

                  {showgrid &&
                    !showend &&
                    !showerror &&
                    !submitted &&
                    !missingdata ? (
                    <div>
                      {!customView ? (
                        <h1 class="h1tasks">
                          {count + 1}. {projectContributers[count]}
                        </h1>
                      ) : null}

                      <Grid>
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
                          color="secondary"
                          variant="inline"
                          inputvarient="outlined"
                          label="End Date"
                          value={endDate}
                          formate="MM/dd/yyy"
                          onChange={this.setendDate}
                        ></KeyboardDatePicker>
                      </MuiPickersUtilsProvider>

                      <Box
                        component="form"
                        sx={{ "& .MuiTextField-root": { m: 1, width: "50ch"} }}
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
                      {!customView ? (
                        <div class="containerbuttons">
                          <button
                            class="buttondir back"
                            type="button"
                            varient="contained"
                            color="primary"
                            onClick={this.handleBack}
                          >
                            <span color="primary"> PREV</span>
                          </button>
                          <button
                            class="buttondir forward"
                            type="button"
                            varient="contained"
                            color="primary"
                            onClick={this.handleNext}
                          >
                            <span color="primary"> NEXT</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div class="containerbuttons">
                    {(showsubmit || customView) &&
                      showgrid &&
                      !submitted &&
                      !missingdata ? (
                      <button
                        class="buttonsubmittask"
                        type="button"
                        varient="contained"
                        color="primary"
                        onClick={this.handleClick}
                      >
                        <span color="primary">SUBMIT</span>
                      </button>
                    ) : null}
                  </div>
                </Paper>
              </Grid>
            </div>
          </form>
        </div>


      </div>
    );
  }
} //end of class
