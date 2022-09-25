import React, {Component} from 'react'
import "./sideBarStyle.css"

// **** Import this file and use it in each component ********
export default class Sidebar extends Component{
    render(){
        return(
            <div className="mainComponent">
                <h1 className="title">This is the Side Bar</h1>
            </div>
        )
    }
}