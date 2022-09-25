import React, {Component} from 'react'
import "./clientshomestyle.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className="sideBarClientsComponent">
                <h4 className="clientsSideBarTitle">Clients</h4>
                <div className="clients_sidebar_client_container">
                    {this.props.clients.length > 0 ?
                        this.props.clients.map((client,index)=> {
                            let client_style = ""
                            if(index%4==0){
                                client_style = "clients_sidebar_client0"
                            }else if(index%4==1){
                                client_style = "clients_sidebar_client0"
                            }else if(index%4==2){
                                client_style = "clients_sidebar_client0"
                            }else if(index%4==3){
                                client_style = "clients_sidebar_client0"
                            }
                            console.log(client.Projects)
                            return(
                                <div className="clients_sidebar_client"  id={client_style} key={index}>
                                    <h2 className="clients_sidebar_client_title">Client Name</h2>
                                    <h5 className="clients_sidebar_client_email">{client.Client.clientName}</h5>
                                    <h2 className="clients_sidebar_client_title">Client Email</h2>
                                    <h5 className="clients_sidebar_client_email">{client.Client.email}</h5>
                                    <h2 className="clients_sidebar_client_title">Projects of the Client</h2>
                                    {
                                        client.Projects.map((project,index2)=>{
                                            if(project!=null){
                                                return(
                                                    <h5 className="clients_sidebar_client_email">{project.name}</h5>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        })
                        :
                        <div className="clients_sidebar_error">
                            <h6>{this.props.sideBarError}</h6>
                        </div>}
                </div>
            </div>
        )
    }
}
