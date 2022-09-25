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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Helmet } from 'react-helmet'

const TITLE ='Task View'
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const StyledTableCellDue = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    color: "#ff0000",
  },
}));


const StyledTableCellNotDue = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    color: "#00ff00",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000000",
    color: "#ffffff",
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
      openProject: "",
      open: false,
    };
  }

  componentDidMount() {

   }

  setOpen = (event) => {
    if (this.state.open) {
      this.setState({ open: false });
    } else if (!this.state.open) {
      this.setState({ open: true, openProject: this.state.row.name });
    }
  };

  taskDelete = (event) => {
    console.log(event.target.value)
  /*******************************
     axios
      .post("http://localhost:8070/task/deleteTask", {
        task_id: this.state.row.history[event.target.value].task_id,
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload(false);
      });
   */
  };

  setProjectedit = (event) => {
    console.log("edit" + event.target.value);
    console.log(this.state.openProject);
    //console.log(this.state.row.history)
  };

  DeleteProject = (event) => {
    console.log("delete" + event.target.value);

    //delete project
    //code
  };

  handler = (event) => {
    console.log("cell" + event.target.value);
  };

  render() {
    const { row, open } = this.state;

    return (
      <React.Fragment>
        <StyledTableRow
          sx={{ "& > *": { borderBottom: "0px", border: "0px" } }}
          value={row.name}
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={this.setOpen}
              value={row.name}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="left">{row.overdue}</TableCell>
          {new Date(row.overdue) > Date.now() || row.status === "Completed" ? (
            <StyledTableCellNotDue align="left">
              {row.status}
            </StyledTableCellNotDue>
          ) : null}
          {new Date(row.overdue) <= Date.now() && row.status !== "Completed" ? (
            <StyledTableCellDue align="left">{row.status}</StyledTableCellDue>
          ) : null}

          <TableCell align="left">{row.description}</TableCell>

          <TableCell align="left">
            {row.admins.map((adminsname, index) => (
              <div>
                {index + 1}.{adminsname}
              </div>
            ))}
          </TableCell>
        </StyledTableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0,backgroundColor: '#525252' }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  backgroundColor: "#394b5b",
                  borderRadius: "3px",
                  width: "100%",
                }}
              >
                <Typography 
                  row
                  variant="h6"
                  gutterBottom
                  component="div"
                  marginLeft="10px"
                >
                  Tasks Status
                </Typography>
                <Table size="small" aria-label="stat">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Task Name</TableCell>
                      <TableCell align="left">Due Date</TableCell>
                      <TableCell align="left"></TableCell>

                      <TableCell align="left" colSpan={2}>
                        Status
                      </TableCell>
                      <TableCell align="center">Contributers</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody width="100%" >
                    {row.history.length === 0 ? (
                      <div>
                        No tasks have assigned
                        <StyledTableCell>
                          <a href="http://localhost:3000/createtask">
                            <button class="buttonsubmitactionaddtask">
                              Add Task
                            </button>
                          </a>
                        </StyledTableCell>
                      </div>
                    ) : null}
                    {row.history.map((historyRow, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {historyRow.task.substring(0, 50)}{" "}
                        </TableCell>
                        <TableCell align="left" colSpan={2}>
                          {historyRow.date}
                        </TableCell>
                        {(historyRow.taskstat === 'Done' || (historyRow.taskstat === 'Review')) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#00ff00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'In Progress' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#00FF00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'In Progress' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#FF0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'To Do' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#00FF00' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'To Do' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#FF0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'Bugs/Issues' && (new Date(historyRow.date) > Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#ffb300' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        {(historyRow.taskstat === 'Bugs/Issues' && (new Date(historyRow.date) < Date.now())) ?
                          <TableCell align="left" colSpan={2} sx={{ color: '#ff0000' }}>
                            {historyRow.taskstat}
                          </TableCell>
                          : null}
                        <TableCell align="left">
                          {historyRow.employee.map((data, index) => (
                            <Box sx={{ margin: 0 }}>
                              <TableRow>
                                <StyledTableCell align="left" border="none">
                                  {index + 1}.{data.substring(0, 25)}
                                </StyledTableCell>
                              </TableRow>
                            </Box>
                          ))}
                        </TableCell>
                        <TableCell align="left">
                        <button
                              class="taskdeletebutton"
                              type="submit"
                              onClick={this.taskDelete}
                            >
                              <DeleteForeverIcon />
                              Delete
                            </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {row.history.length !== 0 ? (
                      <div>
                        <StyledTableCell>
                          <a href="http://localhost:3000/createtask">
                            <button class="buttonsubmitactionaddtask">
                              Add Task
                            </button>
                          </a>
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
    this.state = {
      rows: [],
      filterdresult: [],
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
          console.log("length" + resources.length);

          axios
            .post("http://localhost:8070/task/getTasksOfProject", {
              project_id: resources[i].id,
            })
            .then((response) => {
              // console.log("resonse data " + response.data.response.length);

              if (response.data.response.length > 0) {
                for (let k = 0; k < response.data.response.length; k++) {
                  var data = response.data.response[k];

                  if (data.assigned_to.length > 0) {
                    console.log(data.assigned_to.length);

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
                        console.log(employeenamelist);
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

              if (
                historyArray.length === 0 &&
                resources[i].projectStatus !== "Pending"
              ) {
                ProjecTStat = "Not Started";
              } else if (
                historyArray.length === 0 &&
                resources[i].projectStatus === "Pending"
              ) {
                ProjecTStat = "Pending";
              } else {
                var Completed = false;
                for (let y = 0; y < historyArray.length; y++) {
                  console.log(historyArray[y].taskstat);
                  if (
                    historyArray[y].taskstat === "To Do" ||
                    historyArray[y].taskstat === "In Progress" ||
                    historyArray[y].taskstat === "Bugs/Issues"
                  ) {
                    ProjecTStat = "On going";
                    break;
                  } else if (
                    historyArray[y].taskstat === "Review" ||
                    historyArray[y].taskstat === "Done"
                  ) {
                    ProjecTStat = "Completed";
                    Completed = true;
                  } else if (!Completed) {
                    ProjecTStat = "Overdue";
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
    console.log(event.target.value);
    console.log("fired");

    this.setState({
      filterdresult: this.state.rows,
    });
    var copyArray = [];
    for (var i = 0; i < this.state.rows.length; i++) {
      if (
        this.state.rows[i].name.toLowerCase().includes(value.toLowerCase()) ||
        value === ""
      ) {
        copyArray.push(this.state.rows[i]);
      }
    }
    this.setState({
      filterdresult: copyArray,
    });
  };

  mouseClick = (index) => {
    console.log(index);
  };

  render() {
    const { filterdresult } = this.state;

    if(filterdresult.length===0){
      return(
        <div>
           <Helmet>
          <title>{ TITLE }</title>
        </Helmet>
        <div><h3 style={{color:'white', marginLeft:'500px', font:'30px', marginTop:'200PX'}}>No data to show.</h3></div>
        </div>
      )
    }

    return (
      <div>
        <div class="serachbar">
        <Helmet>
          <title>{ TITLE }</title>
        </Helmet>
          <Box>
            <SearchIcon fontSize="large" htmlColor="#ffffff" />
            <InputBase
              sx={{ htmlcolor: "white" }}
              placeholder="Search for project name....."
              onChange={this.filterProjects}
            ></InputBase>
          </Box>
        </div>
        <Paper class="PAPER">
          <TableContainer sx={{ maxHeight: 580 }}>
            <Table 
              stickyHeader
              aria-label="collapsible table"
              sx={{
                "& .MuiTableRow-root:hover": {
                  backgroundColor: "#93aeb0",
                  opacity: 0.8,
                },
              }}
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell />
                  <StyledTableCell>Project Title</StyledTableCell>
                  <StyledTableCell align="left">Due Date</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Description</StyledTableCell>
                  <StyledTableCell align="left">Admins</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filterdresult.map((row, index) => {
                  if(index%2==0){
                    return(
                      <Row key={row.name} row={row}></Row>
                    )
                  }else{
                    return(<Row style={{backgroundColor:"red"}} key={row.name} row={row}></Row>)
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
