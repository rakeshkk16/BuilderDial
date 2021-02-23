/*global chrome*/
import React, { Component }  from  'react';
import ChangePwd from './changepwd/changepwd.component';

import './settings.styles.css';

const axios = require('axios').default;

export class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: props?.userData?.isUserAuthenticated,
            userToken: {
                access_token: props?.userData?.token
            },
            showChangePwd: false
        }
        console.log(props);
        this.onLogOut = this.onLogOut.bind(this);
        this.onChangePwd = this.onChangePwd.bind(this);
        this.onChangePwdSubmit = this.onChangePwdSubmit.bind(this);
    }

    componentDidMount() {
        console.log('Setting ngOnInit ' + this.state.showChangePwd);
    }

    onLogOut(e) {
        e.preventDefault();
        console.log(this.props.callStatus);
        if (this.props.callStatus.makeCall && !this.props.callStatus.gettingCall && !this.props.callStatus.onCall) {
            axios.post(process.env.REACT_APP_signOutUrl, this.state.userToken)
            .then(response => {
                // isSignedOut = true;
                console.log('Successfully Logged Out');
                this.setState({isUserAuthenticated: false}, () => {this.props.onSessionOut(this.state)});
                var user = { isUserAuthenticated: false };
                chrome.runtime.sendMessage({ userAuthentication: user });         
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    onChangePwd() {
        this.setState({showChangePwd: true});
    }

    onChangePwdSubmit() {
        this.setState({showChangePwd: false});
    }

    render() {
        console.log('Setting rendered ' + this.state.showChangePwd);
        return (
            <div>
                {   this.state.showChangePwd 
                    ?   <ChangePwd onChangePwd={this.onChangePwdSubmit} userData={this.props?.userData}></ChangePwd>
                    :   <div className="midblock customScrollY historymainBox" id="show_history_setting">
                            <div className="settingBox" id="show_setting">
                                <div className="title"> Settings </div>                  
                                <div className="settingListing changePwd">
                                <div className="infosection">
                                    <div className="setting-txt">Change Password</div>
                                    <div  onClick={this.onChangePwd} className="arrow"></div>
                                </div>
                                </div>
                                <div className="settingListing" id="signOutSection">
                                    <div className="infosection">
                                        <div className="setting-txt">Sign Out</div>
                                        <div onClick={this.onLogOut} id="signOut" className="arrow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }

}

export default Settings;
