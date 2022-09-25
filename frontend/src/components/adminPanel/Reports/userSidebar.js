import React, {Component} from 'react'
import "./reportsSidebar.css";
import { withRouter } from "react-router-dom";




class UserSidebar extends Component{
    componentDidMount() {
        fetch('http://localhost:8070/employee/user/' + this.props.data.email)
            .then(response => response.json())
            .then((response) => this.setState({
                user: response,
            }));
        //added by Malaka, will change your project page title - delete after read :)
        document.title = "PROJECT"
    }

    render(){
        const user = this.props.data;
        return(
            <div className="reportsSideBarComponent">
                {this.props.data.map(user =>
                <div className="userReportsSideBarComponent">
                
                    <div class="container">
                        <img src={require('../../../assests/images/avatar.jpeg').default}  className="image" />
                    
        </div>

                    <h6 className="reportsSidebarText">{user.name}</h6>
                    <h6 className="reportsSidebarText">{user.position}</h6>
                    <h6 className="reportsSidebarText">{user.email}</h6>
                    <h6 className="reportsSidebarText">{user.notes}</h6>

               
                </div>
                )}
            </div>
        )}
        
}
export default withRouter(UserSidebar);