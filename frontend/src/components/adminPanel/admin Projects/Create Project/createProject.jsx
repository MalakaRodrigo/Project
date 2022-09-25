import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Box,
  FormControlLabel,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import "./createprojectStyles.css";
import "../Admin project Home/loadingPage.css";
import axios from "axios";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Helmet } from 'react-helmet'

const TITLE = 'Create Project'


const paperStyle = {
  padding: "50px 20px",
  width: "80%",
  margin: "20px auto",
  marginTop:"5%",
  backgroundColor: "#2f3640",
  color: "white",

  opacity: 0.8,
};
const avatarStyle = {
  backgroundColor: "#000000",
  margin: "0px"
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
const styles = {
  floatingLabelFocusStyle: {
      color: "white"
  }
}


class Createproject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      employeesCopy: [],
      employeesasadmins: [],
      projectname: "",
      adminstrsselected: [],
      employeesselected: [],
      currentProjects: [],
      sameName: false,
      description: "",
      datenow: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      selectedEmployees: [],
      selectedManagers: [],
      category: "Pending",
      loading: false,
      error: false,
      submitted: false
    };
  }

  componentDidMount() {
    this.getEmployees()
    this.getProjects()
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setProjectname = (event) => {
    let value = event.target.value
    let lengthvalue = value.length
    console.log(this.state.currentProjects)
    console.log(value)
    for (let i = 0; i < this.state.currentProjects.length; i++) {
      if ((((this.state.currentProjects[i].name).toLowerCase()) === value.toLowerCase()) && lengthvalue !== 0) {
        this.setState({
          sameName: true
        })
        break;
      } else {
        this.setState({
          sameName: false
        })
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
      return (
        employeelist.email === this.state.employees[index].email ? false : true
      )
    })
    this.setState({
      employees: newcontributorlist,
    });
  };

  setSelectedManagers = (event) => {
    let index = event.target.value;
    this.state.selectedManagers.push(this.state.employeesasadmins[index]);

    const newcontributorlist = this.state.employeesasadmins.filter((employeelist) => {
      return (
        employeelist.email === this.state.employeesasadmins[index].email ? false : true
      )
    })

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
    axios.get("http://localhost:8070/projects")
      .then((response) => {
        var projectData = []
        projectData = response.data;
        this.setState({
          currentProjects: projectData
        })
      })
  }
  getEmployees() {
    axios.get('http://localhost:8070/employee/allEmployees')
      .then((response) => {
        let employeelist = []
        for (var i = 0; i < response.data.length; i++) {
          var employee = [
            {
              username: response.data[i].name,
              email: response.data[i].email
            }
          ]
          employeelist.push(employee[0])
        }
        this.setState({
          employees: employeelist,
          employeesasadmins: employeelist,
          employeesCopy: employeelist
        })

      })
  }

  handleClick = (event) => {

    for (var i = 0; i < this.state.selectedEmployees.length; i++) {
      let email_ = this.state.selectedEmployees[i].email;
      this.state.employeesselected.push(email_);
    }

    for (var j = 0; j < this.state.selectedManagers.length; j++) {
      this.state.adminstrsselected.push(this.state.selectedManagers[j].email); //email or username
    }

    for (let i = 0; i < this.state.currentProjects.length; i++) {
      if ((((this.state.currentProjects[i].name.toLowerCase())) === this.state.projectname.toLowerCase())) {
        this.setState({
          error: true,
          sameName: true
        })
        break;
      }
    }

    if (
      (this.state.projectname === "" ||
        this.state.description === "" ||
        this.state.selectedManagers.length === 0 ||
        this.state.selectedEmployees.length === 0 ||
        this.state.category === "" ||
        this.state.endDate === null || this.state.sameName)
    ) {
      this.setState({
        error: true,
      });
    } else {

      this.setState({
        submitted: true,
      })
      var temp_project = [{
        name: this.state.projectname,
        members: this.state.employeesselected,
        projectStatus: this.state.category,
        overdue: this.state.endDate,
        administrators: this.state.adminstrsselected,
        discription: this.state.description,
      }];

      axios.post("http://localhost:8070/projects", temp_project[0])
        .then((response) => {

        }).catch((error) => {console.log(error);})
    }

  };

  clearForm = (event) => {
    this.setState({
      employees: this.state.employeesCopy,
      employeesasadmins: this.state.employeesCopy,
      projectname: "",
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
      submitted: false
    })
  }

  returntoPage = (event) => {
    this.setState({
      error: false,
      loading: false,
      submitted: false
    })
  }

  render() {






    const { selectedEmployees, employees, employeesasadmins, selectedManagers, category, sameName, error, submitted } =
      this.state;

    return (
      <Grid>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <form >
          <div >
            <Grid >
              <Paper elevation={20} style={paperStyle}>
              
                <Grid align="left">
                
                  <div>
                  <div style={{marginLeft:"90%"}}>
                  {!submitted || error ?
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

                  <h1 class='h1project'>CREATE PROJECT</h1>
                  <Typography variant="caption">
                    {!submitted || error ? <p className="fc">Please fill this from to create a project</p>
                      : null}

                  </Typography>
                </Grid>
                {error ? <Grid>
                  <div>
                    Reqired Data is missing.
                    <br />
                  </div>
                </Grid> : null}
                {!error ? <Grid>

                  <TextField
                  InputLabelProps={{
                    style: {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      width: '100%',
                      color: '#a4b0be'
                    } }}

                  

                  fullWidth
                  label="Project Name"
                  
                  value={this.state.projectname}
                  onChange={this.setProjectname}
                  
                ></TextField>
                {sameName ? <div><h5>Project name already exits.</h5></div> : null}
                <FormControl class="marginedit">
                  
                  <h6 className="fc">Project Status</h6>
                
                  <RadioGroup row value={category} onChange={this.setCategory}>
                    <FormControlLabel
                    className="fc"
                      value="Pending"
                      control={<Radio />}
                      label="Pending"
                    />
                    <FormControlLabel
                    className="fc"
                      value="Not Started"
                      control={<Radio />}
                      label="Not Started"
                    />
                    <FormControlLabel
                    className="fc"
                      value="On going"
                      control={<Radio />}
                      label="On going"
                    />
                    <FormControlLabel
                    className="fc"
                      value="Completed"
                      control={<Radio />}
                      label="Completed"
                    />
                    <FormControlLabel
                    className="fc"
                      value="Over due"
                      control={<Radio />}
                      label="Over due"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl 
                className="fc" fullWidth label="" minWidth="300px">
                  <InputLabel style={{color:'#a4b0be'}}>Project Contributers</InputLabel>


                  <Select style={{color:'#a4b0be'}} value={''} MenuProps={MenuProps} onChange={this.setSelectedContributor}>
                    {employees.map((employeename, index) => (
                      <MenuItem key={index} value={index}>
                        {employeename.username}
                      </MenuItem>
                    ))}
                  </Select>
                  {selectedEmployees.map((selectedm, number) => (
                    <Chip variant="outlined" direction="column"
                      size="small"
                      key={number}
                      label={selectedm.username}
                    ></Chip>
                  ))}
                </FormControl>


                <FormControl fullWidth label="admin" minWidth="300px">
                  <InputLabel style={{color:'#a4b0be'}}>Project Managers</InputLabel>
                  <Select value={''}
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
                    <Chip variant="outlined" direction="column"
                      key={number}
                      size="small"
                      label={selected.username}
                    ></Chip>

                  ))}
                </FormControl>

                <MuiPickersUtilsProvider utils={DateFnsUtils} InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: '#a4b0be'
                      } }}>
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
                     InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: '#a4b0be'
                      } }}
                      fullWidth
                      label="Project Description"
                      id="outlined-multiline-flexible"
                      multiline
                      maxRows={4}
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


                </Grid> : null}

              </Paper>
            </Grid>


            <div>


            </div>
          </div>
        </form>
      </Grid>
    );
  }
}

export default Createproject;

