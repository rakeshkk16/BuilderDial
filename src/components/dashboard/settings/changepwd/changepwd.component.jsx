/*global chrome*/
import React, { Component }  from  'react';

import './changepwd.styles.css';

const axios = require('axios').default;

export class ChangePwd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: props?.userData?.isUserAuthenticated,
            currentPwd: '',
            newPwd: '',
            confirmPwd: '',
            errMsg: ''
        }
        this.handleCurrPwdChange = this.handleCurrPwdChange.bind(this);
        this.handleNewPwdChange = this.handleNewPwdChange.bind(this);
        this.handleConfirmPwdChange = this.handleConfirmPwdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkResetForm = this.checkResetForm.bind(this);
    }

    handleCurrPwdChange(event) {
        this.setState({currentPwd: event.target.value});
    }

    handleNewPwdChange(event) {
        this.setState({newPwd: event.target.value});
    }

    handleConfirmPwdChange(event) {
        this.setState({confirmPwd: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.checkResetForm()) {
            let data = {
                access_token: this.props?.userData?.token,
                current_password: this.state.currentPwd,
                password: this.state.newPwd,
                password_confirmation: this.state.confirmPwd
            }
            axios.put('https://staging-pb.engineer.ai/api/public/twilio/change_password', data)
            .then(response => {
                this.props.onChangePwd();
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.data.message);
                    this.setState({errMsg: error.response.data?.message});
                } else if (error.request) {
                    this.setState({errMsg: error.request});
                    console.log(error.request);
                } else {
                    this.setState({errMsg: error});
                    console.log(error);
                }
            })
        }
    }

    checkResetForm() {
        var oldP = this.state.currentPwd;
        var newP = this.state.newPwd;
        var confirmP = this.state.confirmPwd;
        if((oldP.indexOf(' ') >= 0) || (newP.indexOf(' ') >= 0) || (confirmP.indexOf(' ') >= 0)) {
            this.setState({errMsg: 'Space are not allowed'});
            return false;
        } else {
          if (oldP !== "" && newP !== "" && confirmP !== "") {
            if (oldP !== newP) {
              if (newP === confirmP) {
                this.setState({errMsg: ''});
                return true;
              }
              else {
                this.setState({errMsg: 'Confirm password is not same as your new password.'});
                return false;
              }
            }
            else {
                this.setState({errMsg: 'This is Your Old Password,Please Provide A New Password.'});
                return false;
            }
          }
          else {
            this.setState({errMsg: 'All Fields Are Required.'});
            return false;
          }
        }
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <div id="changepwdscreen" className="changepwdBox" > 
                    <h1 className="title">Change Password</h1>
                    <div>
                        <label style={{color:'red'}}>{this.state.errMsg}</label>
                    </div>
                    <div className="inputBlock">
                        <div>
                        <label for="password">Current Password</label>
                        <input type="password" className="password" value={this.state.currentPwd} onChange={this.handleCurrPwdChange}/>
                        </div>
                        <div>
                        <label for="password">New Password</label>
                        <input type="password" className="password" value={this.state.newPwd} onChange={this.handleNewPwdChange}/>
                        </div>
                        <div>
                        <label for="password">Confirm Password</label>
                        <input type="password" className="password" value={this.state.confirmPwd} onChange={this.handleConfirmPwdChange}/>
                        </div>
                    </div>
                    <div className="actionBox">
                        <button className="brandbtn" type='submit' value="Submit">Save </button>
                    </div>
                </div> 
            </form>
        )
    }

}

export default ChangePwd;
