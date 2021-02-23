/*global chrome*/
import React, { Component }  from  'react';
import './dashboard.styles.css';
import CallHistory from  './callhistory/callhistory.component';
import DialPad from './dialpad/dialpad.component';
import Settings from './settings/settings.component';


export class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            countryName: '',
            regionName: '',
            callObject: '',
            showCalls: false,
            showDialPad: true,
            showSetting: false,
            callStatus: '',
            isUserAuthenticated: props?.userData?.isUserAuthenticated
        }
        this.triggerLogOut = this.triggerLogOut.bind(this);
        this.onCallFromLogs = this.onCallFromLogs.bind(this);
        this.getCallStatus = this.getCallStatus.bind(this);
        this.displaySection = this.displaySection.bind(this);
    }

    componentDidMount() {
        console.log(this.state);
        // let bg = chrome.extension.getBackgroundPage();
        // console.log(bg);
        // this.setState({
        //     footer_navigation: ((!bg.deviceOffline && bg.isUserAuthenticated) ? true : false)
        // }, () => console.log('footer ' + this.state.footer_navigation))
      }

    displaySection = (sectionName) => {
        console.log('display section ' + sectionName);
        this.setState({
            showCalls : (sectionName === 'calllogs') ? true : false,
            showDialPad : (sectionName === 'dialpad') ? true : false,
            showSetting : (sectionName === 'settings') ? true : false
        })
    }

    triggerLogOut(data) {
        console.log('logOut triggered');
        this.setState({isUserAuthenticated: data.isUserAuthenticated});
        this.props.onAction(data);
        console.log(data);
    }

    onCallFromLogs(data) {
        console.log('call Initiated from CallHistory');
        this.setState({callObject: data});
        if (data) {
            this.displaySection('dialpad');
        }
    }

    getCallStatus(data) {
        this.setState({callStatus: data});
    }

    render() {
        console.log('dashboard rendered');
        return (
            <div>
                <div>
                {console.log('logged status ' + this.props.isLoggedIn + ' show call ' + this.state.showCalls + ' show dialpad ' + this.state.showDialPad + ' show setting ' + this.state.showSetting )}
                {   this.state.showCalls 
                        ? <CallHistory callFromLogs={this.onCallFromLogs} userData={this.props?.userData}></CallHistory>
                        : null
                }
                {   this.state.showDialPad 
                        ? <DialPad callStatus={this.getCallStatus} geoData={this.props?.userData?.geoData} callObject={this.state.callObject}></DialPad>
                        : null
                }
                {   this.state.showSetting 
                        ?  <Settings onSessionOut={this.triggerLogOut} callStatus={this.state.callStatus} userData={this.props?.userData}></Settings>
                        : null
                }
                </div>
                <div>
                    <div className="dialpad-footer">
                        <div className="ftrListing">
                        <button type="button" className={"show_history " + (this.state.showCalls ? 'active' : '')} onClick={() => this.displaySection('calllogs')}> 
                            <span className="history"></span> History
                        </button>
                        <button type="button" className={"show_dialpad " + (this.state.showDialPad ? 'active' : '')} onClick={() => this.displaySection('dialpad')}>
                            <span className="dialkeypad"></span>Keypad
                        </button>
                        <button type="button" className={"show_setting " + (this.state.showSetting ? 'active' : '')} onClick={() => this.displaySection('settings')}>  
                            <span className="setting"></span>Settings
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            
            
        )
    }

}

export default Dashboard;
