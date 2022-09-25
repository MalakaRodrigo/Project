import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import axios from "axios";
import "./viewTaskStyles.css";
import { InputBase } from "@material-ui/core";
import Createtask from "../createTask/createTask"
import Edittask from "../Edit tasks/edittask"
import { Helmet } from 'react-helmet'


const TITLE = 'Task View'
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: '#2f3640',
    color:"white"
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const StyledTableCellDue = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    color: "#ff0000",
  },
}));


const StyledTableCellNotDue = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    color: "#00ff00",

  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2f3640",
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    width: "40px",
    border: 0,
  },
}));

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: this.props.row,
      open: false,
    };
    this.createTaskfromthis.bind(this)
    this.taskEdit.bind(this)
  }

  setOpen = (event) => {
    if (this.state.open) {
      this.setState({ open: false });
    } else if (!this.state.open) {
      this.setState({ open: true });
    }
  };

  taskDelete = (event) => {
    var newrow = []
    for (let i = 0; i < this.state.row.history.length; i++) {
      if (i !== event.target.value) {
        newrow.push(this.state.row.history[i])
      }
    }
    axios
      .post("http://localhost:8070/task/deleteTask", {
        task_id: this.state.row.history[event.target.value].task_id,
      })
      .then((response) => {
        this.setState({ open: false });
      });

  };

  createTaskfromthis = () => {
    this.props.setStateOfParent("Task created");
  }

  taskEdit = (event) => {
    let task_id = this.state.row.history[event.target.value].task_id
    this.props.setStateOfParent2(task_id);
  }

  render() {
    const { row, open } = this.state;

    return (
      <React.Fragment>
        <StyledTableRow key={this.props.key}
          sx={{ "& > *": { borderBottom: "0px", border: "0px" } }}>
          <TableCell >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={this.setOpen}
              value={row.name}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell >
          <TableCell style={{color:'white', fontSize:'15px'}} component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell style={{color:'white', fontSize:'15px'}} align="left">{row.overdue}</TableCell>
          {new Date(row.overdue) > Date.now() || row.status === "Completed" ? (
            <StyledTableCellNotDue style={{borderBottom:'0px solid white'}} align="left">
              {row.status}
            </StyledTableCellNotDue>
          ) : null}
          {new Date(row.overdue) <= Date.now() && row.status !== "Completed" ? (
            <StyledTableCellDue style={{borderBottom:'0px solid white'}} align="left" >{row.status}</StyledTableCellDue>
          ) : null}

          <TableCell style={{color:'white', fontSize:'15px'}} align="left">{row.description}</TableCell>

          <TableCell style={{color:'white', fontSize:'15px'}} align="left">
            {row.admins.map((adminsname, index) => (
              <div>
                {index + 1}.{adminsname}
              </div>
            ))}
          </TableCell>
        </StyledTableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#1e272e', color: 'white' }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  backgroundColor: "#1e272e",
                  borderRadius: "3px",
                  width: "100%",
                }}
              >
                <Typography
                  row
                  variant="subtitle"
                  gutterBottom
                  component="div"
                  marginLeft="10px"
                >
                  T A S K&nbsp;&nbsp;  S T A T U S
                </Typography>
                <Table size="small" aria-label="stat" >
                  <TableHead>
                    <StyledTableRow>
                      <TableCell align="left" style={{color:'white', fontSize:'15px'}}>Task Name</TableCell>
                      <TableCell align="left" style={{color:'white', fontSize:'15px'}}>Due Date</TableCell>
                      <TableCell align="left" style={{color:'white', fontSize:'15px'}}></TableCell>

                      <TableCell align="left" style={{color:'white', fontSize:'15px'}}>
                        Status
                      </TableCell>
                      <TableCell align="center" colSpan={1} style={{color:'white', fontSize:'15px'}}>Contributers</TableCell>
                      <TableCell align="center" colSpan={1} style={{color:'white', fontSize:'15px'}}></TableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody width="100%" >
                    {row.history.length === 0 ? (
                      <div>
                        No tasks have assigned
                        <StyledTableCell>

                          <button class="buttonsubmitactionaddtask" onClick={this.createTaskfromthis}>
                            Add Task
                          </button>

                        </StyledTableCell>
                      </div>
                    ) : null}
                    {row.history.map((historyRow, index) => (
                      <TableRow key={index}>
                        <TableCell align="left" style={{color:'white', fontSize:'15px'}}>
                          {historyRow.task.substring(0, 30)}{" "}
                        </TableCell>
                        <TableCell align="left" colSpan={2} style={{color:'white', fontSize:'15px'}}>
                          {historyRow.date}
                        </TableCell>
                        {(historyRow.taskstat === 'Done') ?
                          <TableCell align="left" sx={{ color: '#00FF00' }}>
                            {historyRow.taskstat}&emsp;&emsp;
                          </TableCell>
                          : null}
                        {((historyRow.taskstat === 'Review')) ?
                          <TableCell align="left" sx={{ color: '#00FF00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'In Progress' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" sx={{ color: '#FFFF00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'In Progress' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" sx={{ color: '#FF0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'To Do' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" sx={{ color: '#00FF00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'To Do' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" sx={{ color: '#FF0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'Bugs/Issues' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" sx={{ color: '#ffff00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'Bugs/Issues' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" sx={{ color: '#ff0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'Overdue' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" sx={{ color: '#ff0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}

                        <TableCell align="left">
                          {historyRow.employee.map((data, index) => (
                            <Box sx={{ margin: 0 }}>
                              <TableRow>
                                <StyledTableCell align="left" border="none" style={{color:'white', fontSize:'15px'}}>
                                  {index + 1}.{data.substring(0, 25)}
                                </StyledTableCell>
                              </TableRow>
                            </Box>
                          ))}
                        </TableCell>
                        <TableCell align="left">

                          <div>
                            <button style={{ fontSize: '9px', marginRight: "0px", backgroundColor: '#2f3640', width: '35px', textAlign: 'center' }}
                              class="taskdeletebutton"
                              type="button"
                              value={index}
                              onClick={this.taskDelete}
                            >

                              Delete
                            </button>

                            <button style={{ fontSize: '9px', marginLeft: "0px", marginRight: "240px", backgroundColor: '#2f3640', width: '35px', textAlign: 'center' }}
                              class="taskdeletebutton"
                              value={index}
                              onClick={this.taskEdit}
                            >

                              Edit
                            </button>
                          </div>

                        </TableCell>
                      </TableRow>
                    ))}
                    {row.history.length !== 0 ? (
                      <div>
                        <StyledTableCell>

                          <button class="buttonsubmitactionaddtask" onClick={this.createTaskfromthis}>
                            Add Task
                          </button>

                        </StyledTableCell>
                      </div>
                    ) : null}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
}

Row.propTypes = {
  row: PropTypes.shape({
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    overdue: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        task: PropTypes.string.isRequired,
        employee: PropTypes.arrayOf(
          PropTypes.shape({
            ename: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    taskstatus: PropTypes.string.isRequired,
    admins: PropTypes.arrayOf(
      PropTypes.shape({
        adminsname: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default class Viewtasks extends React.Component {
  constructor(props) {
    super(props);
    this.setStateOfParent.bind(this)
    this.setStateOfParent2.bind(this)
    this.state = {
      rows: [],
      filterdresult: [],
      createTaskstat: false,
      edittaskstat: false,
      editId: 0
    };

  }

  componentDidMount() {
    this.getProjectstoRender();
  }

  getProjectstoRender = () => {
    let resources = [];
    let tempArray = [];

    axios
      .get("http://localhost:8070/projects")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          //response.data.length
          const project = [
            {
              id: response.data[i]._id,
              name: response.data[i].name,
              members: response.data[i].members,
              projectStatus: response.data[i].projectStatus,
              overdue: response.data[i].overdue.toString().substring(0, 10),
              administrators: response.data[i].administrators,
              discription: response.data[i].discription.substring(0, 50),
            },
          ];
          resources.push(project[0]);
        }

        for (let i = 0; i < resources.length; i++) {
          let historyArray = [];
          axios
            .post("http://localhost:8070/task/getTasksOfProject", {
              project_id: resources[i].id,
            })
            .then((response) => {
              if (response.data.response.length > 0) {
                for (let k = 0; k < response.data.response.length; k++) {
                  var data = response.data.response[k];

                  if (data.assigned_to.length > 0) {
                    let employeelist = [];
                    for (var z = 0; z < data.assigned_to.length; z++) {
                      var name = data.assigned_to[z];
                      employeelist.push(name);
                    }
                    /////////////////////////////////////
                    let employeenamelist = [];

                    axios
                      .get("http://localhost:8070/employee/allEmployees")
                      .then((response) => {
                        var localdata;
                        localdata = response.data;
                        for (var l = 0; l < employeelist.length; l++) {
                          for (var m = 0; m < localdata.length; m++) {
                            if (employeelist[l] === localdata[m]._id) {
                              employeenamelist.push(localdata[m].email); //email name or anything
                            }
                          }
                        }
                        employeelist = employeenamelist;
                      })
                      .catch((error) => {
                        console.log(error);
                      });

                    ///////////////////////////////////////
                    var history = [
                      {
                        date: data.due_date.toString().substring(0, 10),
                        task: data.task_name,
                        employee: employeenamelist,
                        taskstat: data.task_status,
                        task_id: data._id,
                      },
                    ];
                    historyArray.push(history[0]);
                  }
                }
              } //end of if
            })
            .then(() => {
              var ProjecTStat = "-";

              if (new Date(resources[i].overdue) < Date.now()
              ) {
                ProjecTStat = "Overdue";
              }
              else if (
                resources[i].projectStatus === "Pending"
              ) { //pending status for initial tasks
                ProjecTStat = "Pending";
              } else if (
                historyArray.length === 0 &&
                resources[i].projectStatus !== "Pending"
              ) { //Not strated status for projects that are approved but not yet tasks are assignnd
                ProjecTStat = "Not Started";
              } else {
                for (let y = 0; y < historyArray.length; y++) {
                  if (historyArray[y].taskstat === "Overdue") {
                    ProjecTStat = "Overdue";
                    break;
                  }
                  else if (
                    historyArray[y].taskstat === "To Do" ||
                    historyArray[y].taskstat === "In Progress" ||
                    historyArray[y].taskstat === "Bugs/Issues"
                  ) {
                    ProjecTStat = "On going";
                    continue;
                  } else if (
                    historyArray[y].taskstat === "Review" ||
                    historyArray[y].taskstat === "Done"
                  ) {
                    ProjecTStat = "Completed";
                  }
                }
              }

              let sendData = { projectStatus: ProjecTStat };
              axios.post(
                "http://localhost:8070/projectsstatus/" + resources[i].id,
                sendData
              );

              var projectDetails = [
                {
                  name: resources[i].name,
                  status: ProjecTStat,
                  overdue: resources[i].overdue,
                  description: resources[i].discription,
                  admins: resources[i].administrators,
                  history: historyArray,
                },
              ];
              tempArray.push(projectDetails[0]);

              this.setState({
                rows: tempArray,
                filterdresult: tempArray,
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  filterProjects = (event) => {
    var value = event.target.value;
    this.setState({
      filterdresult: this.state.rows,
    });
    var copyArray = [];
    if (value.length !== 0) {
      for (var i = 0; i < this.state.rows.length; i++) {
        if (
          this.state.rows[i].name.toLowerCase().includes(value.toLowerCase()) || value === ""
        ) {
          copyArray.push(this.state.rows[i]);
        }
      }
      this.setState({
        filterdresult: copyArray,
      });
    }


  };

  setStateOfParent = (newState) => {
    this.setState({
      createTaskstat: true
    })
  }
  setStateOfParent2 = (newState) => {
    this.setState({
      edittaskstat: true,
      editId: newState
    })
  }

  render() {
    const { filterdresult, createTaskstat, edittaskstat } = this.state;




    if (edittaskstat) {
      return (
        <div>
          <Helmet>
            <title>{'Edit Task'}</title>
          </Helmet>
          <Edittask id={this.state.editId} />


        </div>
      )
    }

    if (createTaskstat) {
      return (
        <div>
          <Helmet>
            <title>{'Create Task'}</title>
          </Helmet>
          <Createtask />

        </div>

      )
    } else {
      return (
        <div>
          <div class="serachbar">
            <Helmet>
              <title>{TITLE}</title>
            </Helmet>
            <Box>
              <SearchIcon fontSize="small" htmlColor="#ff0000" />
              <InputBase
                style={{ backgroundColor: "#2f3640 ", fontSize: '12px', width: '200px',color:'white',borderRadius:"10px" }}
                placeholder="    Search by project name "
                onChange={this.filterProjects}
              ></InputBase>
            </Box>
          </div>
          <Paper class="PAPER">
            <TableContainer sx={{ maxHeight: '40%' }}> {/*check this */}
              <Table
                stickyHeader
                aria-label="collapsible table"
                sx={{
                  "& .MuiTableRow-root:hover": {
                    backgroundColor: "#1e272e",
                    opacity: 0.8,
                  },
                }}
              >
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell />
                    <StyledTableCell style={{color:'white', fontSize:'16px'}}>Project Title</StyledTableCell>
                    <StyledTableCell style={{color:'white', fontSize:'16px'}} align="left">Due Date</StyledTableCell>
                    <StyledTableCell style={{color:'white', fontSize:'16px'}} align="left">Status</StyledTableCell>
                    <StyledTableCell style={{color:'white', fontSize:'16px'}} align="left">Description</StyledTableCell>
                    <StyledTableCell style={{color:'white', fontSize:'16px'}} align="left">Admins</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {filterdresult.map((row, index) => {
                    
                      if(index%2===0){
                        return(
                         <Row  key={row.name} row={row} setStateOfParent={this.setStateOfParent} setStateOfParent2={this.setStateOfParent2}></Row>
                        )
                      }else{
                        return(
                        <Row key={row.name} row={row} setStateOfParent={this.setStateOfParent} setStateOfParent2={this.setStateOfParent2}></Row>
                        )
                      }
                      
                    })}
                  
                 
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      );
    }

  }
}
