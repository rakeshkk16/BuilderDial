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
            showCalls: false,
            showDialPad: true,
            showSetting: false,
            isUserAuthenticated: props?.userData?.isUserAuthenticated
        }
        console.log(props);
        this.triggerLogOut = this.triggerLogOut.bind(this);
    }

    componentDidMount() {
        let bg = chrome.extension.getBackgroundPage();
        this.setState({
            footer_navigation: ((!bg.deviceOffline && bg.isUserAuthenticated) ? false : true)
        })
      }

    displaySection = (sectionName) => {
        this.setState({
            showCalls : (sectionName === 'calllogs') ? true : false,
            showDialPad : (sectionName === 'dialpad') ? true : false,
            showSetting : (sectionName === 'settings') ? true : false
        })
    }

    triggerLogOut(data) {
        this.setState({isUserAuthenticated: data.isUserAuthenticated});
        this.props.onAction(data);
        console.log(data);
    }

    render() {

        return (
            <div>
                <div>
                {console.log('logged status ' + this.props.isLoggedIn + ' show call ' + this.state.showCalls + ' show dialpad ' + this.state.showDialPad + ' show setting ' + this.state.showSetting )}
                {   this.state.showCalls 
                        ? <CallHistory userData={this.props?.userData}></CallHistory>
                        : null
                }
                {   this.state.showDialPad 
                        ? <DialPad geoData={this.props?.userData?.geoData}></DialPad>
                        : null
                }
                {   this.state.showSetting 
                        ?  <Settings onSessionOut={this.triggerLogOut} userData={this.props?.userData}></Settings>
                        : null
                }
                </div>
                <div style={{ display: (this.state.footer_navigation ? 'block' : 'none') }}>
                    <div className="dialpad-footer">
                        <div className="ftrListing">
                        <button type="button" className="show_history" onClick={() => this.displaySection('calllogs')}> 
                            <span className="history"></span> History
                        </button>
                        <button type="button" className="show_dialpad" onClick={() => this.displaySection('dialpad')}>
                            <span className="dialkeypad"></span>Keypad
                        </button>
                        <button type="button" className="show_setting" onClick={() => this.displaySection('settings')}>  
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
