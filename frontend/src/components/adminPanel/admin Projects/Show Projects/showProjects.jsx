import React from "react";
import "./showprojectStyles.css";
import "./showprojecteditStyles.css";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
//Table
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { InputBase } from "@material-ui/core";
//icons
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import RuleIcon from '@mui/icons-material/Rule';
import { Helmet } from "react-helmet";

//////////////////////////////////////////////////////////////////////////////////////
import {
  Avatar,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  FormControlLabel,
} from "@material-ui/core";
import "./showprojecteditStyles.css";
import "../Admin project Home/loadingPage.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import { TableBody } from "@mui/material";
/////////

const TITLE = "Project View";
//styleset
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default class ShowProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: [],
      gridDataSave: [],
      projectData: [],
      workingData: [],
      taskData: [],
      pageCount: 0,
      MAX_PAGES: 0,
      sendData: [],
      editproject: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.getAllProjectsAndWorking();
  }

  getAllProjectsAndWorking() {
    let GridStructure = [];

    axios.get("http://localhost:8070/projects").then((response) => {
      var projectData = [];
      projectData = response.data;

      this.setState({
        MAX_PAGES: projectData.length - 1,
      });

      for (let i = 0; i < projectData.length; i++) {
        let workingData = [];
        axios
          .get(
            "http://localhost:8070/dashboard/gettotaltimeofproject/" +
            projectData[i].name
          )
          .then((response) => {
            workingData = response.data;
          })
          .then(() => {
            let ID = { project_id: projectData[i]._id };
            let taskData = [];
            let allTasks = [];
            axios
              .post("http://localhost:8070/task/getTasksOfProject", ID)
              .then((response) => {
                taskData = response.data.response;
                let totalTimeProject = { hrs: 0, mins: 0, secs: 0 };
                for (let z = 0; z < taskData.length; z++) {
                  var taskLog = [];
                  let Time = { hrs: 0, mins: 0, secs: 0 };
                  for (var y = 0; y < workingData.length; y++) {
                    if (
                      taskData[z].task_name === workingData[y][2] &&
                      taskData[z].project_name === workingData[y][1]
                    ) {
                      taskLog.push(workingData[y]);
                      Time.hrs += parseInt(workingData[y][5].substring(0, 2));
                      Time.mins += parseInt(workingData[y][5].substring(3, 5));
                      if (Time.mins - 60 > 1) {
                        Time.hrs++;
                        Time.mins = Time.mins - 60;
                      }
                      Time.secs += parseInt(workingData[y][5].substring(6, 8));
                      if (Time.secs - 60 > 1) {
                        Time.mins++;
                        Time.secs = Time.secs - 60;
                      }
                    }
                  }
                  let aTask = {
                    taskName: taskData[z].task_name,
                    taskStatus: taskData[z].task_status,
                    tasktime: Time,
                    taskWorking: taskLog,
                  };
                  totalTimeProject.hrs = totalTimeProject.hrs + Time.hrs;
                  totalTimeProject.mins = totalTimeProject.mins + Time.mins;
                  if (totalTimeProject.mins - 60 > 0) {
                    totalTimeProject.hrs++;
                    totalTimeProject.mins = totalTimeProject.mins - 60;
                  }
                  totalTimeProject.secs = totalTimeProject.secs + Time.secs;
                  if (totalTimeProject.secs - 60 > 0) {
                    totalTimeProject.mins++;
                    totalTimeProject.secs = totalTimeProject.secs - 60;
                  }
                  allTasks.push(aTask);
                }

                let Structure = [
                  {
                    p_totalTime: totalTimeProject,
                    p_details: projectData[i],
                    t_details: allTasks,
                  },
                ];
                GridStructure.push(Structure[0]);
                if (GridStructure.length - 1 === this.state.MAX_PAGES) {
                  this.setState({
                    gridData: GridStructure,
                    gridDataSave: GridStructure,
                    loading: false,
                  });
                } else {
                  this.setState({
                    loading: true,
                  });
                }
              });
          });
      }
    });
  }

  gridPageChangeNext = (event) => {
    let id = this.state.pageCount;
    if (id < this.state.MAX_PAGES) {
      this.setState({
        pageCount: id + 1,
      });
    }
  };

  gridPageChangePrev = (event) => {
    let id = this.state.pageCount;
    if (id - 1 >= 0) {
      this.setState({
        pageCount: id - 1,
      });
    }
  };



  filterProjects = (event) => {
    var value = event.target.value;
    var searchPage = 0;
    for (var i = 0; i < this.state.gridData.length; i++) {
      if (
        this.state.gridData[i].p_details.name
          .toLowerCase()
          .includes(value.toLowerCase())
      ) {
        searchPage = i;
      }
    }
    this.setState({
      pageCount: searchPage,
    });
  };

  deleteProject = (event) => {
    let ID = this.state.gridData[this.state.pageCount].p_details._id;
    axios
      .delete("http://localhost:8070/employee/projectdelete/" + ID)
      .then((response) => {
        axios
          .delete("http://localhost:8070/task/deleteallTaskofthisproject/" + ID)
          .then((response) => {
            window.location.reload(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  editProject = (event) => {
    this.setState({ editproject: true, sendData: this.state.gridData[this.state.pageCount].p_details });
  };

  render() {
    const { gridData, pageCount, loading, editproject, sendData } = this.state;
    if (editproject) {
      return (
        <div>
          <Editproject key={pageCount} details={sendData} />
        </div>
      );
    }

    if (!loading && !editproject) {
      return (
        <div>
          <Box
            style={{
              backgroundColor: "#2f3640",
              marginLeft: "20px",
              marginRight: "10px",
              marginTop: "0px",
            }}
          >
            <Grid container>
              <Grid
                item
                style={{
                  backgroundColor: "#525252",
                  padding: "0px",
                  marginLeft: "40%",
                  width: "400px",
                  marginRight: "80px",
                  marginTop: "0px",
                  marginBottom: "10px",
                }}
              ></Grid>
            </Grid>
            <Grid container style={{ marginTop: "0px" }}>
              <Grid
                item
                style={{
                  backgroundColor: "transparent",
                  opacity: 0.8,
                  marginLeft: "20px",
                  borderRadius: "8px",
                  color:"white",
                  alignItems: "center",
                  width: "300px",
                }}
              >
                <h1
                  style={{
                    color: "white",
                    font: "30px Helvetica",
                    textAlign: "center",
                    marginTop: "30%",
                  }}
                >
                  {gridData[pageCount].p_details.name}
                </h1>
                <Grid>
                {gridData[pageCount].p_details.projectStatus === "On going" ? (
                  <Grid
                    item
                    style={{
                      backgroundColor: "trasnparent",
                      padding: "0px",
                      width: "400px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        marginLeft: "20px",
                        marginRight: "10px",
                        marginBottom: "0px",
                        paddingTop: "10px",
                        color: "#FFFF00",
                        
                      }}
                    >
                      
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        marginLeft: "70px",
                        font: "5px",
                        marginTop: "0px",
                        color: "#FFFF00",
                        width:"400px"
                      }}
                    >
                      <RuleIcon fontSize="small" htmlColor="#FFFF00" />
                      {" "}
                      {gridData[pageCount].p_details.projectStatus}{" "}
                    </Typography>
                  </Grid>
                ) : null}
                {gridData[pageCount].p_details.projectStatus === "Completed" ? (
                  <Grid
                    item
                    style={{
                      backgroundColor: "trasnparent",
                      padding: "0px",
                      width: "400px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        marginLeft: "20px",
                        marginRight: "10px",
                        marginBottom: "0px",
                        paddingTop: "10px",
                        color: "#FFFF00",
                      }}
                    >
                     
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        marginLeft: "70px",
                        font: "5px",
                        marginTop: "0px",
                        color: "#00FF00",
                        width: "400px",
                      }}
                    >
                       <AssignmentTurnedInIcon
                        fontSize="small"
                        htmlColor="#00FF00"
                      />
                      {" "}
                      {gridData[pageCount].p_details.projectStatus}{" "}
                    </Typography>
                  </Grid>
                ) : null}
                {gridData[pageCount].p_details.projectStatus === "Overdue" ? (
                  <Grid
                    item
                    style={{
                      backgroundColor: "trasnparent",
                      padding: "0px",
                      width: "400px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        marginLeft: "20px",
                        marginRight: "10px",
                        marginBottom: "0px",
                        paddingTop: "10px",
                        color: "#FFFF00",
                      }}
                    >
                      
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        marginLeft: "70px",
                        font: "5px",
                        marginTop: "0px",
                        color: "red",
                        width: "400px",
                      }}
                    >
                      <MoreTimeIcon fontSize="small" htmlColor="red" />
                      {" "}
                      {gridData[pageCount].p_details.projectStatus}{" "}
                    </Typography>
                  </Grid>
                ) : null}
                {gridData[pageCount].p_details.projectStatus === "Pending" ||
                  gridData[pageCount].p_details.projectStatus ===
                  "Not Started" ? (
                  <Grid
                    item
                    style={{
                      backgroundColor: "trasnparent",
                      padding: "0px",
                      width: "400px",
                    }}
                  >
                    <Typography
                      variant="h5"
                      style={{
                        marginLeft: "20px",
                        marginRight: "10px",
                        marginBottom: "0px",
                        paddingTop: "10px",
                        color: "#FFFF00",
                      }}
                    >
                      
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        marginLeft: "70px",
                        font: "5px",
                        marginTop: "0px",
                        color: "#4bcffa",
                        width: "400px",
                      }}
                    >
                      <PendingIcon fontSize="small" htmlColor="#4bcffa" />
                      {" "}
                      {gridData[pageCount].p_details.projectStatus}{" "}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
              </Grid>

              <Grid>
                {" "}
                <Box style={{ width: "400px", marginLeft: "30px"}}>
                  <p
                    style={{
                      color: "#e8e8e8",
                      opacity: "0.8",
                      fontSize: "20PX",
                      marginTop: "20%",
                    }}
                  >
                    Project Description 
                    <br/>
                    <span row style={{ color: "white", fontSize: "18PX" }}>
                      {gridData[pageCount].p_details.discription}
                    </span>{" "}
                  </p>
                </Box>
              </Grid>
              <Grid>
                <div className="searchbox">
                <Box style={{ marginLeft: "200px",width:"650px" }}>
                  <SearchIcon marginLeft="20px" fontSize="large" htmlColor="red" />
                  <InputBase
                    style={{
                      borderBottom: "2px solid red",
                      marginTop: "10px",
                      color:"white",
                      
                      
                    }}
                    placeholder="Search for project name....."
                    onChange={this.filterProjects}
                  ></InputBase>

                  <Grid style={{ marginLeft: "0px", marginTop: "10px"}}>
                    <button
                      class="directionButtons project_addButtonContainer"
                      type="submit"
                      style={{ marginLeft: "20px", marginTop: "5px" }}
                      onClick={this.gridPageChangePrev}
                    >
                      Prev Project
                    </button>
                    <button
                      class="directionButtons project_addButtonContainer"
                      type="submit"
                      style={{ marginLeft: "20px", marginTop: "5px" }}
                      onClick={this.gridPageChangeNext}
                    >
                      Next Project
                    </button>
                    <br />
                    <p style={{ marginLeft: "30px",color: "white" }}>
                      {" "}
                      Page {pageCount + 1} of {gridData.length}
                    </p>

                    <button
                      type="submit"
                      class="project_addButtonContainer"
                      onClick={this.deleteProject}
                      style={{
                        //backgroundColor: "transparent",
                        //border: "1px solid black",
                        marginLeft: "20px",
                      }}
                    >
                      <DeleteForeverIcon />
                      Delete Project
                    </button>
                    <button
                      type="button"
                      onClick={this.editProject}
                      class="project_addButtonContainer"
                      style={{
                       
                       
                       // border: "1px solid black",
                        marginLeft: "20px",
                        //color: "white"
                      }}
                    >
                      <EditIcon />
                      Edit Project
                    </button>
                  </Grid>
                </Box>
                </div>
              </Grid>
              <Grid
                style={{
                  marginLeft: "20px",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                <p style={{ font: "15px Helvetica", color: "white" }}>
                  End Date&ensp; :&emsp;
                  {gridData[pageCount].p_details.overdue.substring(0, 10)}{" "}
                  &emsp;&emsp; Total Time spent&ensp; :&emsp;
                  {gridData[pageCount].p_totalTime.hrs} Hrs{" "}
                  {gridData[pageCount].p_totalTime.mins} Mins{" "}
                  {gridData[pageCount].p_totalTime.secs} Secs
                </p>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Grid container>
              <Grid style={{ marginLeft: "30px", marginTopt: "30px" }}>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Grid
              conatiner
              item
              style={{
                backgroundColor: "trasnparent",
                padding: "0px",
                marginTop: "0px",
              }}
            >
              <Grid
                style={{
                  marginLeft: "30px",
                  marginTop: "10px",
                  marginBottom: "0px",
                  color: "#ffffff",
                  fontSize: "20px",
                }}
              >
                <h6>Team Members</h6>
              </Grid>
              <Grid container style={{ marginLeft: "30px" }}>
                {gridData[pageCount].p_details.members.map(
                  (members, memberindex) => (
                    <Grid>
                      {" "}
                      <p
                        style={{
                          marginLeft: "20px",
                          marginTopt: "0px",
                          border: "none",
                          color: "#ffffff",
                          fontSize: "15px",
                        }}
                      >
                        {memberindex + 1}.{members}
                      </p>
                    </Grid>
                  )
                )}
              </Grid>

              <Paper style={{ marginLeft: "30px", marginRight: "10px" }}>
                <TableContainer sx={{ maxHeight: 580 }}>
                  {gridData[pageCount].t_details.map((tasks, index) => (
                    <Table style={{ backgroundColor: "#2f3640" }}>
                      <TableHead>
                        <StyledTableRow
                          style={{ border: "none" }}
                          value={index}
                        >
                          <TableCell
                            style={{
                              width: "30%",
                              border: "none",
                              color: "white",
                              fontSize: "18px",
                            }}
                          >
                            {tasks.taskName}
                          </TableCell>


                          <TableCell style={{ border: "none" }}></TableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableRow>
                          <TableCell
                            style={{
                              border: "none",
                              color: "white",
                              fontSize: "18px",
                            }}
                          >
                            Task Status :-  {tasks.taskStatus}
                          </TableCell>
                          <TableCell colSpan={4}
                            style={{
                              border: "none",
                              color: "white",
                              fontSize: "18px",
                            }}
                          >
                            Total Time Spent :-  {tasks.tasktime.hrs} Hrs {tasks.tasktime.mins} Mins{" "}
                            {tasks.tasktime.secs} Secs
                          </TableCell>

                        </StyledTableRow>
                      </TableBody>
                      {tasks.taskWorking.length ?

                        <TableBody>

                          <StyledTableRow>
                            <TableCell colSpan={5} align='center' style={{ border: 'none',color:"white" }}>
                              &nbsp;&nbsp;       T A S K &nbsp;&nbsp; A C T I V I T I E S
                            </TableCell>

                          </StyledTableRow>
                          <StyledTableRow style={{ border: "none" }}>
                            <TableCell

                              style={{
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              Employee Name
                            </TableCell>
                            <TableCell
                              colSpan={1}
                              style={{
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              Task Start Time
                            </TableCell>
                            <TableCell
                              style={{
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              Task End Time
                            </TableCell>
                            <TableCell
                              colSpan={1}
                              style={{
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              Total Time
                            </TableCell>
                            <TableCell
                              style={{
                                border: "none",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              Memo
                            </TableCell>
                          </StyledTableRow>

                          {tasks.taskWorking.map((taskwork, indextask) => {
                               if(indextask%2==0){
                                 return(<StyledTableRow style={{backgroundColor:"#1e272e"}}>
                                 <TableCell
                                   colSpan={1}
                                   style={{
                                     border: "none",
                                     color: "#969696",
                                     fontSize: "16px",
                                     
                                   }}
                                 >
                                   {taskwork[0]}
                                 </TableCell>
                                 <TableCell
                                   colSpan={1}
                                   style={{
                                     border: "none",
                                     color: "#969696",
                                     fontSize: "16px",
                                   }}
                                 >
                                   {taskwork[3]}
                                 </TableCell>
                                 <TableCell
                                   style={{
                                     border: "none",
                                     color: "#969696",
                                     fontSize: "16px",
                                   }}
                                 >
                                   {taskwork[4]}
                                 </TableCell>
                                 <TableCell
                                   colSpan={1}
                                   style={{
                                     border: "none",
                                     color: "#969696",
                                     fontSize: "16px",
                                   }}
                                 >
                                   {taskwork[5]}
                                 </TableCell>
                                 <TableCell
   
                                   style={{
                                     border: "none",
                                     color: "#969696",
                                     fontSize: "16px",
                                   }}
                                 >
                                   {taskwork[6]}
                                 </TableCell>
                               </StyledTableRow>)
                                

                               }else{
                                return(<StyledTableRow style={{backgroundColor:"#2f3640"}}>
                                <TableCell
                                  colSpan={1}
                                  style={{
                                    border: "none",
                                    color: "#969696",
                                    fontSize: "16px",
                                    
                                  }}
                                >
                                  {taskwork[0]}
                                </TableCell>
                                <TableCell
                                  colSpan={1}
                                  style={{
                                    border: "none",
                                    color: "#969696",
                                    fontSize: "16px",
                                  }}
                                >
                                  {taskwork[3]}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "none",
                                    color: "#969696",
                                    fontSize: "16px",
                                  }}
                                >
                                  {taskwork[4]}
                                </TableCell>
                                <TableCell
                                  colSpan={1}
                                  style={{
                                    border: "none",
                                    color: "#969696",
                                    fontSize: "16px",
                                  }}
                                >
                                  {taskwork[5]}
                                </TableCell>
                                <TableCell
  
                                  style={{
                                    border: "none",
                                    color: "#969696",
                                    fontSize: "16px",
                                  }}
                                >
                                  {taskwork[6]}
                                </TableCell>
                              </StyledTableRow>)

                               }   

  })}

                        </TableBody>



                        :  <StyledTableRow>
                        <TableCell colSpan={5} align='center' style={{ border: 'none',color:"white" }}>
                          &nbsp;&nbsp;       No active activities
                        </TableCell>

                      </StyledTableRow>}


                      <StyledTableRow />

                      <StyledTableRow>
                        <TableCell colSpan={6} align='center' style={{ borderBottom: '1px solid white' }}>


                        </TableCell>
                      </StyledTableRow>


                    </Table>

                  ))}
                </TableContainer>
                <Grid>
                  <Box
                    style={{
                      backgroundColor: "#2f3640",
                      width: "100%",
                      textAlign: "center",
                      color:"white"
                    }}
                  >
                    End of Rows
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          </Box>
          <div>

          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Helmet>
            <title>{TITLE}</title>
          </Helmet>

          <h3
            style={{
              color: "white",
              marginLeft: "500px",
              font: "30px",
              marginTop: "200PX",
            }}
          >
            No data to show.
          </h3>

          <div>
          </div>
        </div>
      );
    }
  }
}

const paperStyle = {
  padding: "50px 20px",
  width: "700px",
  margin: "20px auto",
  backgroundColor: "#425e6e",
  opacity: 0.8,
};
const avatarStyle = {
  backgroundColor: "#000000",
  margin: "0px",
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

class Editproject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      employeesasadmins: [],
      employeesCopy: [],
      projectname: this.props.details.name,
      adminstrsselected: [],
      employeesselected: [],
      currentProjects: [],
      sameName: false,
      description: '',
      datenow: new Date(),
      startDate: new Date(),
      endDate: this.props.details.overdue,
      selectedEmployees: [],
      selectedManagers: [],
      category: this.props.details.projectStatus,
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    this.getEmployees();
    this.getProjects();
    this.interval = setInterval(
      () =>
        this.setState(() => {
          if (navigator.onLine) {
            this.setState({
              loading: false,
            });
          } else {
            this.setState({
              loading: true,
            });
          }
        }),
      1000
    );
  }
  componentWillMount() {
    this.setState({
      description: this.props.details.discription,
    })
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setProjectname = (event) => {
    let value = event.target.value;
    let lengthvalue = value.length;
    for (let i = 0; i < this.state.currentProjects.length; i++) {
      if (
        this.state.currentProjects[i].name.toLowerCase() ===
        value.toLowerCase() &&
        lengthvalue !== 0
      ) {
        this.setState({
          sameName: true,
        });
      } else {
        this.setState({
          sameName: false,
        });
      }
    }
    this.setState({
      projectname: event.target.value,
    });
  };

  setProjectdescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  setSelectedContributor = (event) => {
    let index = event.target.value;
    this.state.selectedEmployees.push(this.state.employees[index]);
    const newcontributorlist = this.state.employees.filter((employeelist) => {
      return employeelist.email === this.state.employees[index].email
        ? false
        : true;
    });
    this.setState({
      employees: newcontributorlist,
    });
  };

  setSelectedManagers = (event) => {
    let index = event.target.value;
    this.state.selectedManagers.push(this.state.employeesasadmins[index]);

    const newcontributorlist = this.state.employeesasadmins.filter(
      (employeelist) => {
        return employeelist.email === this.state.employeesasadmins[index].email
          ? false
          : true;
      }
    );

    this.setState({
      employeesasadmins: newcontributorlist,
    });
  };

  setstartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  setendDate = (date) => {
    this.setState({
      endDate: date,
    });
  };

  setCategory = (event) => {
    this.setState({ category: event.target.value });
  };

  getProjects() {
    axios.get("http://localhost:8070/projects").then((response) => {
      var projectData = [];
      projectData = response.data;
      this.setState({
        currentProjects: projectData,
      });
    });
  }

  getEmployees() {
    axios
      .get("http://localhost:8070/employee/allEmployees")
      .then((response) => {
        let employeelist = [];
        for (var i = 0; i < response.data.length; i++) {
          var employee = [
            {
              username: response.data[i].name,
              email: response.data[i].email,
            },
          ];
          employeelist.push(employee[0]);
        }
        this.setState({
          employees: employeelist,
          employeesasadmins: employeelist,
          employeesCopy: employeelist,

        });
      });
  }

  handleClick = (event) => {
    for (var i = 0; i < this.state.selectedEmployees.length; i++) {
      let email_ = this.state.selectedEmployees[i].email;
      this.state.employeesselected.push(email_);
    }

    for (var j = 0; j < this.state.selectedManagers.length; j++) {
      this.state.adminstrsselected.push(this.state.selectedManagers[j].email); //email or username
    }


    if (
      this.state.projectname === "" ||
      this.state.description === "" ||
      this.state.selectedManagers.length === 0 ||
      this.state.selectedEmployees.length === 0 ||
      this.state.category === "" ||
      this.state.endDate === null ||
      this.state.sameName
    ) {
      this.setState({
        error: true,
      });
    } else {
      var temp_project = [
        {
          members: this.state.employeesselected,
          projectStatus: this.state.category,
          overdue: this.state.endDate,
          administrators: this.state.adminstrsselected,
          discription: this.state.description,
        },
      ];

      axios
        .put("http://localhost:8070/projectdetail/" + this.props.details._id, temp_project[0])
        .then((response) => {
        }).catch((error) => {console.log(error);});
    }

  };


  clearForm = (event) => {
    this.setState({
      employees: this.state.employeesCopy,
      employeesasadmins: this.state.employeesCopy,
      adminstrsselected: [],
      employeesselected: [],
      sameName: false,
      description: "",
      datenow: new Date(),
      endDate: new Date(),
      selectedEmployees: [],
      selectedManagers: [],
      category: "Pending",
      loading: false,
      error: false,
    })
  }


//still checking - does not print to console
  deleteManagerChip = (event) => {
    console.log("delete button");
    console.log(event.name);
  };

  render() {

    if (this.state.error) {
      return (
        <div>
          <div class="ring1">
            <span class="span1"></span>
          </div>
          <div>
            <a href="http://localhost:3000/projects">
              <button class="loadingbutton" onClick={this.backtoHome}>
                {" "}
                Invalid, Please Fill all the details.
                <br />
                Click here to continue
              </button>
            </a>
          </div>
        </div>
      );
    }

    const {
      selectedEmployees,
      employees,
      employeesasadmins,
      selectedManagers,
      category,
      sameName,
    } = this.state;

    return (
      <div class="float-parent-element">
        <div class="float-child-element">
          <div class="maincomponentshowproject">
            <Grid class>
              <form>
                <div>
                  <Grid>
                    <Paper elevation={20} style={paperStyle}>
                      <div>
                        <button type="button" class="buttonsubmitclear" onClick={this.clearForm}>C L E A R</button>

                        <a href="http://localhost:3000/projects">
                          <button type="submit" class="closebuttonactual">C L O S E</button>
                        </a>
                      </div>
                      <Grid align="left">
                        <div>
                          <Avatar style={avatarStyle}>
                            <AddCircleOutlineOutlinedIcon
                              fontSize="large"
                              htmlColor="#ffffff"
                            />
                          </Avatar>
                        </div>

                        <h1 class="h1project">EDIT PROJECT</h1>
                        <Typography variant="caption">
                          <p>Please fill this from to edit a project</p>
                        </Typography>
                      </Grid>

                      <TextField
                        disabled={true}
                        value={this.props.details.name}
                        fullWidth
                        label="Project Name"
                      ></TextField>
                      {sameName ? (
                        <div>
                          <h5>Project name already exits.</h5>
                        </div>
                      ) : null}
                      <FormControl class="marginedit">
                        <FormLabel>Project Status</FormLabel>
                        <RadioGroup row value={category} onChange={this.setCategory}>
                          <FormControlLabel
                            value="Pending"
                            control={<Radio />}
                            label="Pending"
                          />
                          <FormControlLabel
                            value="Not Started"
                            control={<Radio />}
                            label="Not Started"
                          />
                          <FormControlLabel
                            value="On going"
                            control={<Radio />}
                            label="On going"
                          />
                          <FormControlLabel
                            value="Completed"
                            control={<Radio />}
                            label="Completed"
                          />
                          <FormControlLabel
                            value="Over due"
                            control={<Radio />}
                            label="Over due"
                          />
                        </RadioGroup>
                      </FormControl>
                      <FormControl fullWidth label="" minWidth="300px">
                        <InputLabel>Project Contributers</InputLabel>

                        <Select
                          value={""}
                          MenuProps={MenuProps}
                          onChange={this.setSelectedContributor}
                        >
                          {employees.map((employeename, index) => (
                            <MenuItem key={index} value={index}>
                              {employeename.username}
                            </MenuItem>
                          ))}
                        </Select>
                        {selectedEmployees.map((selectedm, number) => (
                          <Chip
                            variant="outlined"
                            size="sizeSmall"
                            key={number}
                            label={selectedm.username}
                          ></Chip>
                        ))}
                      </FormControl>

                      <FormControl fullWidth label="admin" minWidth="300px">
                        <InputLabel>Project Managers</InputLabel>
                        <Select
                          value={""}
                          MenuProps={MenuProps}
                          onChange={this.setSelectedManagers}
                        >
                          {employeesasadmins.map((name, index) => (
                            <MenuItem key={index} value={index}>
                              {name.username}
                            </MenuItem>
                          ))}
                        </Select>
                        {selectedManagers.map((selected, number) => (
                          <Chip
                            variant="outlined"
                            key={number}
                            size="sizeSmall"
                            label={selected.username}
                          ></Chip>
                        ))}
                      </FormControl>

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          variant="inline"
                          inputvarient="outlined"
                          label="End Date"
                          value={this.state.endDate}
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
                            label="Project Description"
                            id="outlined-multiline-flexible"
                            multiline
                            maxRows={4}
                            placeholder={'heelo'}
                            value={this.state.description}
                            onChange={this.setProjectdescription}
                          />
                        </div>
                      </Box>
                      <div>
                        <button
                          class="buttonsubmit"
                          type="submit"
                          varient="contained"
                          color="primary"
                          onClick={this.handleClick}
                        >
                          Submit and Create{" "}
                        </button>
                      </div>
                    </Paper>
                  </Grid>

                  <div></div>
                </div>
              </form>

            </Grid>

          </div>
        </div>
        <div class="float-child-element">
          <div class="sidebarshowproject"></div>
        </div>
      </div>
    );
  }
}
