import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import axios from 'axios';
import Clientsidebar from "./clientsidebar";
import "./clientshomestyle.css"
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {ThemeProvider} from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import {blankHeaderOpts} from "plotly.js/src/components/updatemenus/constants";

const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

const currentt = new Date();
// By default US English uses 12hr time with AM/PM
const time = currentt.toLocaleTimeString("en-US");

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            projects: [],
            meetings:[],
            searchTerm: "Client1",
            client: {
                client_name: "",
                projects: [],
                email: ""

            },
            meeting: {
                client_id: "",
                venue: "",
                description: "",
                date: ""
            },
            addProject:{
                client_id:"",
                project_id:""
            },
            errorMessage:"There is no errors",
            errorStyle:"clients_no_error",
            deleteClient:{
                client_id:""
            }
        }
    }



    componentDidMount() {
        axios.get('http://localhost:8070/clients/getClients')
            .then((res) => {
                axios.get('http://localhost:8070/projects')
                    .then((res2) => {
                        let clients = res.data
                        let meetings = []
                        clients.map(client=>{
                            client.Client.meetings.map(meeting=>{
                                meetings.push({
                                    client_name:client.Client.clientName,
                                    client_id:client.Client._id,
                                    meeting:meeting
                                })
                            })
                        })
                        this.setState({
                            clients: res.data,
                            meetings:meetings,
                            projects: res2.data
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }

    addClient = () => {
        if(this.state.client.clientName==""||this.state.client.email==""){
            this.setState({
                errorMessage: "Please Fill Client Name and Email",
                errorStyle: "clients_error_message"
            })
        }else{
            const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
            const result = pattern.test(this.state.client.email);
            if (result === true) {
                axios.post('http://localhost:8070/clients/addClients', this.state.client)
                    .then((res) => {
                        axios.get('http://localhost:8070/clients/getClients')
                            .then((res) => {
                                this.setState({
                                    clients: res.data,
                                    client:{
                                        email:"",
                                        clientName:""
                                    },
                                    errorMessage: "Successfully Added Client",
                                    errorStyle: "clients_error_message"
                                })
                            })
                            .catch(error => {
                                this.setState({
                                    errorMessage: "An Error Occurred!",
                                    errorStyle: "clients_error_message"
                                })
                            })
                    })
                    .catch(error => {
                        this.setState({
                            errorMessage: "An Error Occurred!",
                            errorStyle: "clients_error_message"
                        })                    })
            }else{
                this.setState({
                    errorMessage: "Invalid Email!",
                    errorStyle: "clients_error_message"
                })
            }
        }
    }

    addMeeting = () => {
        if(this.state.meeting.client_id==""||this.state.meeting.date==""){
            this.setState({
                errorMessage: "Please Select a Client and Add Date",
                errorStyle: "clients_error_message"
            })
        }else{
            axios.post('http://localhost:8070/clients/addMeeting', this.state.meeting)
                .then((res) => {
                    axios.get('http://localhost:8070/clients/getClients')
                        .then((res) => {
                            let meetings = []
                            res.data.map(client=>{
                                client.Client.meetings.map(meeting=>{
                                    meetings.push({
                                        client_name:client.Client.clientName,
                                        client_id:client.Client._id,
                                        meeting:meeting
                                    })
                                })
                            })
                            this.setState({
                                clients: res.data,
                                meetings:meetings,
                                errorMessage: "Successfully Added Meeting",
                                errorStyle: "clients_error_message"
                            })
                        })
                        .catch(error => {
                            this.setState({
                                errorMessage: "Error Occurred!",
                                errorStyle: "clients_error_message"
                            })
                        })
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Error Occurred!",
                        errorStyle: "clients_error_message"
                    })
                })
        }
    }

    addProject = (e) => {
        if(this.state.addProject.client_id==""||this.state.addProject.project_id==""){
            this.setState({
                errorMessage: "Please Select a Client and a Project",
                errorStyle: "clients_error_message"
            })
        }else{
            axios.post('http://localhost:8070/clients/addProject', this.state.addProject)
                .then((res) => {
                    axios.get('http://localhost:8070/clients/getClients')
                        .then((res) => {

                            this.setState({
                                clients: res.data,
                                errorMessage: "Successfully Added Project",
                                errorStyle: "clients_error_message"
                            })
                        })
                        .catch(error => {
                            this.setState({
                                errorMessage: "Error Occurred!",
                                errorStyle: "clients_error_message"
                            })
                        })
                })
                .catch(error => {
                    this.setState({
                        errorMessage: "Error Occurred!",
                        errorStyle: "clients_error_message"
                    })
                })
        }
    }

    deleteClient = () => {
        if(this.state.deleteClient.client_id==""){
            this.setState({
                errorMessage: "Please Select a Client",
                errorStyle: "clients_error_message"
            })
        }else{
            axios.post('http://localhost:8070/clients/deleteClient', this.state.deleteClient)
                .then((res) => {
                    axios.get('http://localhost:8070/clients/getClients')
                        .then((res) => {

                            this.setState({
                                clients: res.data,
                                errorMessage: "Successfully Deleted Client",
                                errorStyle: "clients_error_message"
                            })
                        })
                        .catch(error => {
                            this.setState({
                                errorMessage: "Error Occurred!",
                                errorStyle: "clients_error_message"
                            })
                        })
                })
                .catch(error => {
                    console.log(error)
                    this.setState({
                        errorMessage: "Error Occurred!",
                        errorStyle: "clients_error_message"
                    })
                })
        }
    }

    setMeetingDate = (date) => {
        this.setState({
            meeting:{
                ...this.state.meeting,
                date:date
            }
        })
    }

    render() {
        const {clients} = this.state
        const materialTheme = createMuiTheme({
            overrides: {
                MuiPickersToolbar: {
                    toolbar: {
                        backgroundColor: "#1e272e",
                    },
                },
                MuiPickersCalendarHeader: {
                    switchHeader: {
                        backgroundColor: "#1e272e",
                        color: "white",
                    },
                },
                MuiPickersDay: {
                    day: {
                        color: "red",
                    },
                    daySelected: {
                        backgroundColor: "#1e272e",
                    },
                    dayDisabled: {
                        color: "red",
                    },
                    current: {
                        color: "white",
                    },
                },
                MuiPickersModal: {
                    dialogAction: {
                        color: "green",
                    },
                },
            },
        });

        return (
            <div className="clientsMainComponent">
                <Clientsidebar clients={this.state.clients} meetings={this.state.meetings}/>
                <div className="clientsSubComponent">
                    <div>
                        <h7 className={this.state.errorStyle}>{this.state.errorMessage}</h7>
                    </div>
                    <div className="addClientsComponents">
                        <div className="addclientsSubComponent">
                            <h5 className="hrTitleText">Add Client</h5>
                            <form className="hrForm">
                                <div className="hrFormSub">
                                    <label className="hrLabel">
                                        Client Name
                                        <input className="hrTextInput" type="text" name="dName"
                                               value={this.state.client.client_name}
                                               onChange={e => this.setState({
                                                   client: {
                                                       ...this.state.client,
                                                       client_name: e.target.value
                                                   }
                                               })}/>
                                    </label>
                                    <label className="hrLabel">
                                        Email
                                        <input className="hrTextInput" type="text" name="dDesc"
                                               value={this.state.client.client_venue}
                                               onChange={e => this.setState({
                                                   client: {
                                                       ...this.state.client,
                                                       email: e.target.value
                                                   }
                                               })}/>
                                    </label>
                                    <label className="hrLabel">
                                        Project
                                        <select className="form-select form-select-sm departments_select "
                                                defaultValue={""}
                                                onChange={e => this.setState({
                                                    client: {...this.state.client, projects: [e.target.value]}
                                                })}
                                        >
                                            <option disabled value={""}> -- Select a Project --</option>
                                            {this.state.projects.map(item => {
                                                return (<option key={item._id}
                                                                value={item._id}>{item.name}</option>);
                                            })}
                                        </select>
                                    </label>
                                </div>
                                <div className="clients_addButtonContainer" onClick={this.addClient}>
                                    <h7 className="clients_addButton">Add Client</h7>
                                </div>
                            </form>
                        </div>

                        <div className="addclientsSubComponent">
                            <h5 className="hrTitleText">Add Project</h5>
                            <form className="hrForm">
                                <div className="hrFormSub">
                                    <label className="hrLabel">
                                        Client
                                        <select className="form-select form-select-sm departments_select "
                                                defaultValue={""}
                                                onChange={e => this.setState({
                                                    addProject: {...this.state.addProject, client_id: e.target.value}
                                                })}
                                        >
                                            <option disabled value={""}> -- Select a Client --</option>
                                            {this.state.clients.map(item => {
                                                return (<option key={item.Client._id}
                                                                value={item.Client._id}>{item.Client.clientName}</option>);
                                            })}
                                        </select>
                                    </label>
                                    <label className="hrLabel">
                                        Project
                                        <select className="form-select form-select-sm departments_select "
                                                defaultValue={""}
                                                onChange={e => this.setState({
                                                    addProject: {...this.state.addProject, project_id: e.target.value}
                                                })}
                                        >
                                            <option disabled value={""}> -- Select a Project --</option>
                                            {this.state.projects.map(item => {
                                                return (<option key={item._id}
                                                                value={item._id}>{item.name}</option>);
                                            })}
                                        </select>
                                    </label>
                                </div>
                                <div className="clients_addButtonContainer" onClick={this.addProject}>
                                    <h7 className="clients_addButton">Add Project</h7>
                                </div>
                            </form>
                        </div>


                        <div className="addclientsSubComponent">
                            <h5 className="hrTitleText">Add Meeting</h5>
                            <form className="hrForm">
                                <div className="hrFormSub">
                                    <label className="hrLabel">
                                        Client
                                        <select className="form-select form-select-sm departments_select "
                                                defaultValue={""}
                                                onChange={e => this.setState({
                                                    meeting: {...this.state.meeting, client_id: e.target.value}
                                                })}
                                        >
                                            <option disabled value={""}> -- Select a Client --</option>
                                            {this.state.clients.map(item => {
                                                return (<option key={item.Client._id}
                                                                value={item.Client._id}>{item.Client.clientName}</option>);
                                            })}
                                        </select>
                                    </label>
                                    <label className="hrLabel">
                                        Venue
                                        <input className="hrTextInput" type="text" name="dName"
                                               value={this.state.meeting.venue}
                                               onChange={e => this.setState({
                                                   meeting: {
                                                       ...this.state.meeting,
                                                       venue: e.target.value
                                                   }
                                               })}/>
                                    </label>
                                    <label className="hrLabel">
                                        Description
                                        <input className="hrTextInput" type="text" name="dDesc"
                                               value={this.state.meeting.description}
                                               onChange={e => this.setState({
                                                   meeting: {
                                                       ...this.state.meeting,
                                                       description: e.target.value
                                                   }
                                               })}/>
                                    </label>
                                    <label className="hrLabel">
                                        Date
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} className="meetingDatePickerContainer">
                                            <ThemeProvider theme={materialTheme}>
                                                <KeyboardDatePicker
                                                    variant="inline"
                                                    inputVarient="outlined"
                                                    value={this.state.meeting.date}
                                                    InputProps={{
                                                        style: {
                                                            fontSize: 14,
                                                            color:"white",
                                                            backgroundColor:"#FF5349",
                                                            outline:"none",
                                                            border:"none",
                                                            paddingLeft:10
                                                        }
                                                    }}
                                                    formate="MM/dd/yyy"
                                                    style={{height:"44px",color:"white"}}
                                                    onChange={this.setMeetingDate}
                                                ></KeyboardDatePicker>
                                            </ThemeProvider>
                                        </MuiPickersUtilsProvider>
                                    </label>
                                    <div className="meetingDatePickerContainer">

                                    </div>
                                </div>
                                <div className="clients_addButtonContainer" onClick={this.addMeeting}>
                                    <h7 className="clients_addButton">Add Meeting</h7>
                                </div>
                            </form>
                        </div>

                        <div className="addclientsSubComponent">
                            <h5 className="hrTitleText">Delete Client</h5>
                            <form className="hrForm">
                                <div className="hrFormSub">
                                    <label className="hrLabel">
                                        Client
                                        <select className="form-select form-select-sm departments_select "
                                                defaultValue={""}
                                                onChange={e => this.setState({
                                                    deleteClient: {...this.state.deleteClient, client_id: e.target.value}
                                                })}
                                        >
                                            <option disabled value={""}> -- Select a Client --</option>
                                            {this.state.clients.map(item => {
                                                return (<option key={item.Client._id}
                                                                value={item.Client._id}>{item.Client.clientName}</option>);
                                            })}
                                        </select>
                                    </label>
                                </div>
                                <div className="clients_addButtonContainer" onClick={this.deleteClient}>
                                    <h7 className="clients_addButton">Delete Client</h7>
                                </div>
                            </form>
                        </div>

                    </div>

                    <div className="clients_table_view">
                        <table className="clientsTable">
                            <tr className="clients_table_head">
                                <th className="clients_table_header_column">Client Name</th>
                                <th className="clients_table_header_column">Venue</th>
                                <th className="clients_table_header_column">Date</th>
                                <th className="clients_table_header_column">Description</th>
                            </tr>

                            {
                                this.state.meetings.map((meeting,index)=>{
                                    if(index%2==0){
                                        return(
                                            <tr className="clients_table_data_odd" key={index}>
                                                <td className="clients_table_data_column">{meeting.client_name}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.venue}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.date.substring(0,10)}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.description}</td>
                                            </tr>
                                        )
                                    }else{
                                        return(
                                            <tr className="clients_table_data_even" key={index}>
                                                <td className="clients_table_data_column">{meeting.client_name}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.venue}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.date.substring(0,10)}</td>
                                                <td className="clients_table_data_column">{meeting.meeting.description}</td>
                                            </tr>
                                        )
                                    }
                                })
                            }
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Clients)