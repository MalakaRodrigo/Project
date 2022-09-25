import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import axios from 'axios';
import Sidebar from "./sidebar";
import "./leave_style.css"
import HRNavbar from "../HRNavBar/hr_navbar";

class Leave extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render(){
        return(
            <div className="leaveMainComponent">
                <HRNavbar/>
                <Sidebar/>
                <div className="leaveSubComponent">
                    <h5 className="hrText">This is the Leave Component</h5>
                </div>
            </div>
        );
    }
}

export default withRouter(Leave)