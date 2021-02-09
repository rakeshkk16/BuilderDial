/*global chrome*/
import React, { Component }  from  'react';

import './settings.styles.css';

const axios = require('axios').default;

export class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: props?.userData?.isUserAuthenticated,
            userToken: {
                access_token: props?.userData?.token
            }
        }
        console.log(props);
        this.onLogOut = this.onLogOut.bind(this);
    }

    onLogOut = e => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_signOutUrl, this.state.userToken)
        .then(response => {
            // isSignedOut = true;
            this.setState({isUserAuthenticated: false}, () => {this.props.onSessionOut(this.state)});
            var user = { isUserAuthenticated: false };
            chrome.runtime.sendMessage({ userAuthentication: user });         
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {

        return (
                <div className="midblock customScrollY historymainBox" id="show_history_setting">
                    <div className="settingBox" id="show_setting">
                        <div className="title"> Settings </div>                  
                        <div className="settingListing changePwd">
                        <div className="infosection">
                            <div className="setting-txt">Change Password</div>
                            <div className="arrow"></div>
                        </div>
                        </div>
                        <div className="settingListing" id="signOutSection">
                            <div className="infosection">
                                <div className="setting-txt">Sign Out</div>
                                <div onClick={this.onLogOut} id="signOut" className="arrow signOut"></div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

}

export default Settings;
