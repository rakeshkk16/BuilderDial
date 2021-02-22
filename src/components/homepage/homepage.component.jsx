/* global chrome */

import React, { Component }  from  'react';

import './homepage.styles.css';

import {Login} from '../login/login.component';
import {Dashboard} from '../dashboard/dashboard.component';
import { Global } from '../globalvariable/golbal.component';

export class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: false,
            userData: ''
          }
        this.handleData = this.handleData.bind(this);
        this.handleSession = this.handleSession.bind(this);
    }

    componentDidMount() {
        let bg = chrome.extension.getBackgroundPage();
        // chrome.storage.local.get(null, (data) => {
        //     console.log('Data fetched from chrome ' + data.userData.isUserAuthenticated);
        //     this.setState({isUserAuthenticated: data.userData.isUserAuthenticated, userData: data.userData});
        //     console.log(this.state);
        // });
        this.setState({isUserAuthenticated: bg.isUserAuthenticated, userData: bg.userData}, () => console.log(this.state));
        // console.log(chrome.extension);
    }

    handleData(data) {
        this.setState({userData: data, isUserAuthenticated: data.isUserAuthenticated}, () => {console.log(this.state)});
    }

    handleSession(data) {
        this.setState({isUserAuthenticated: data.isUserAuthenticated});
    }

    render() {
        return (
               <div>
                    {
                        (this.state.isUserAuthenticated)
                        ?   <Dashboard onAction={this.handleSession} isLoggedIn= {this.state.isUserAuthenticated} userData={this.state.userData}></Dashboard>
                        :   <div>
                                <Login onSubmission={this.handleData}></Login>
                                <div className="footer">
                                    <p>&copy; 2020 Builder. All rights reserved.</p>
                                </div>
                            </div>
                    }           
               </div>
        )
    }

}

export default HomePage;