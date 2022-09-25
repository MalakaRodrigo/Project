import React from "react";
import Projectperformancecharts from './chart'
import { Helmet } from 'react-helmet'

const TITLE ='Analyze Projects'
export default class AnalyzeProjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gridData: [],
        }
    }
    render() {
        return (
            <div>
                <Helmet>
                    <title>{TITLE}</title>
                </Helmet>
                <div>
                    <Projectperformancecharts />
                </div>
            </div>
        )
    }
}





























/*
export default class AnalyzeProjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    componentDidMount() {

    }





render() { return(

    <div>
        <h1>hello world!</h1>
    </div>
)
}






}//end AnalyzeProjects
*/