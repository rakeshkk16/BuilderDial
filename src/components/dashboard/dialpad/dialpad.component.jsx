/*global chrome*/
import React, { Component }  from  'react';

import './dialpad.styles.css';

import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/style.css';

// import 'react-phone-input-2/lib/material.css'

import reloadImg from '../../../images/reload.svg';
import deleteImg from '../../../images/delete.svg';


export class DialPad extends Component {
    constructor(props) {
        super(props)
        this.state = { 
          bgValues: '',
          phone: "" ,
          rawPhone: "",
          staticNumber:'',
          dialCode: this.props.geoData.dial_code,
          makeCall: true,
          gettingCall: false,
          onCall: false,
          showDialPad: true,
          deviceView: '',
          isReservationAvailable: '',
          reservation: '',
          isOnOutgoingCall: false,
          isIncomingCall: false,
          deviceSetupReady: false,
          deviceOffline: false,
          muteValue: false,
          totalSeconds: 0,
          callTimer: '',
          minutesLabel: '',
          secondsLabel: ''
        };
      this.onCallClick = this.onCallClick.bind(this);
      this.onHangUpClick = this.onHangUpClick.bind(this);
      this.onAcceptCall = this.onAcceptCall.bind(this);
      this.onRejectCall = this.onRejectCall.bind(this);
      this.onToggleDialPad = this.onToggleDialPad.bind(this);
      this.handleOnChange = this.handleOnChange.bind(this);
      this.onReload = this.onReload.bind(this);
      this.onBackSpaceKeyPress = this.onBackSpaceKeyPress.bind(this);
      this.onDialKeyPress = this.onDialKeyPress.bind(this);
      this.handleMessage = this.handleMessage.bind(this);
      this.checkDeviceSetup = this.checkDeviceSetup.bind(this);
      this.setTime = this.setTime.bind(this);
    }

    setTime() {
      console.log('setTime called');
      this.setState({
        totalSeconds: (this.state.totalSeconds + 1),
        secondsLabel: this.pad(this.state.totalSeconds % 60),
        minutesLabel: this.pad(parseInt(this.state.totalSeconds / 60))
      });
    }

    pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }

    handleMessage(request) {
      console.log(request);
      switch (request.output) {
        case 'callRejected':
          console.log('outgoing call rejected switch');
          this.setState({makeCall: true, onCall: false, gettingCall: false});
          // this.setState({rawPhone: '', makeCall: true});
          // clearInterval(callTimer);
          // resetTimer();
          // showHideElement([
          //   {name: 'showTimer', flag: false},
          //   {name: 'mute_dialpad', flag: false},
          //   {name: 'dial_keypad_box', flag: true},
          //   {name: 'dial_inputnumber', flag: true},
          //   {name: 'hide_button', flag: true}
          // ]);
          // showHideCallButtons('c');
          // console.log('showHideCallButtons to show call button after call rejected');
          // chrome.runtime.sendMessage({ output: 'IncomingPopup' });
          // document.getElementById('incomingCallBox').style.display = 'none';
          // document.getElementById('outgoingCallBox').style.display = 'block';
          break;
        case 'outgoingCallPicked':
          console.log('outgoing call pick switch');
          clearInterval(this.state.callTimer);
          this.setState({callTimer: setInterval(this.setTime, 1000)});
          break;
        case 'outgoingCallDropped':
          console.log('outgoing switch');
          clearInterval(this.state.callTimer);
          this.setState({
            phone: this.state.phone.slice(0, -(this.state.rawPhone.length)),
            rawPhone: '',
            makeCall: true,
            onCall: false,
            gettingCall: false,
            isOnOutgoingCall: false
          });
          break;
        default:
          break;
      }
      if (request.ReservationCreated) {
        console.log(request.ReservationCreated);
        this.setState({
          makeCall: false,
          onCall: false,
          gettingCall: true,
          showDialPad: false,
          isOnOutgoingCall: false,
          isIncomingCall: true,
          reservation: request.ReservationCreated,
          staticNumber: request.ReservationCreated.task.attributes.caller
        }, () => {console.log(this.state)});
        // showDialPad();
        // isIncomingCall = true;
        // setTimeout(function () {
        //   document.getElementById('dial_keypad_box').style.display = 'none';
        //   showHideCallButtons('a');
        //   console.log('showHideCallButtons to accept for incoming call created');
        // }, 500);
        // reservation = request.ReservationCreated;
        // chrome.browserAction.setIcon({ path: icons.enabled });
        // setDialNumber(reservation.task.attributes.caller);
        // document.getElementById('incomingCallBox').style.display = 'block';
        // document.getElementById('outgoingCallBox').style.display = 'none';
      } else if (request.isRervationActive) {
        this.setState({isReservationAvailable: request.isRervationActive.isReservationAvailable});
      }
     }

    componentDidMount() {
      chrome.runtime.onMessage.addListener(this.handleMessage);
      let bg = chrome.extension.getBackgroundPage();
      // document.getElementById('incomingphoneNumber').innerText =  this.state.rawPhone;
      this.checkDeviceSetup(bg);

    }

    checkDeviceSetup(bg) {
      this.initializeBackgroundValues(bg);
      if (this.state.isUserAuthenticated) {
        if (!this.state.deviceOffline) {
          // showHideElement([
          //   { name: 'dialpad', flag: true },
          //   { name: 'offline', flag: false },
          //   { name: 'authScreens', flag: false },
          // ]);
          if (this.state.deviceSetupReady) {
            // document.getElementById('loading').style.display = 'none';
            this.popupInitialization(bg);
          } else {
            setTimeout(function () {
              this.checkDeviceSetup(bg);
            }, 1000);
          }
        } else {
          // showHideElement([
          //   { name: 'loading', flag: false },
          //   { name: 'loginScreen', flag: true },
          //   { name: 'authScreens', flag: true },
          // ]);
          setTimeout(function () {
            this.checkDeviceSetup();
          }, 3000);
          // document.getElementById('dialpad').style.display = 'none';
        }
      } else {
        // showHideElement([
        //   { name: 'loading', flag: false },
        //   { name: 'onLogOut', flag: false },
        //   { name: 'authScreens', flag: true },
        // ]);
      }
    }

    popupInitialization(bg) {
      document.getElementById("phoneNumber").focus();
      if (this.state.deviceView) {      
        if (this.state.onCall) {     
          // showHideCallButtons('h');
          // console.log('showHideCallButtons to disconnect existing call');
          // setDialNumber(reservation.task.attributes.caller);        
          // callTimer = setInterval(setTime, 1000);
          // showHideElement([
          //   { name: 'showTimer', flag: true },
          //   { name: 'incomingCallBox', flag: true },
          //   { name: 'mute_dialpad', flag: true },
          //   { name: 'outgoingCallBox', flag: false },
          //   { name: 'hide_button', flag: false },
          //   { name: 'dial_keypad_box', flag: false }          
          // ]);
        } else {
          // (outgoingConnection) ? showHideCallButtons('h') : showHideCallButtons('c');
          // console.log('showHideCallButtons to show disconnect for outgoing or show call for no calls');
        }
  
        if (this.state.isIncomingCall) {
          // showHideElement([
          //   { name: 'incomingCallBox', flag: true },
          //   { name: 'outgoingCallBox', flag: false },
          //   { name: 'dial_keypad_box', flag: false }          
          // ]);
          // chrome.browserAction.setIcon({ path: icons.enabled });
          // setDialNumber(reservation.task.attributes.caller);
          // showHideCallButtons('a');
          // console.log('showHideCallButtons to show accept for incoming call');
        }
      } else {
        // console.log('no device');
        // showHideCallButtons('c');
        // console.log('showHideCallButtons to show call button for no device view');
      }
    }
  

    initializeBackgroundValues(bg) {
      console.log(bg);
      this.setState({
        bgValues: bg,
        deviceView: (bg.deviceObject ? bg.deviceObject : this.state.deviceView),
        isOnOutgoingCall: bg.isOnOutgoingCall,
        makeCall: (bg.isOnOutgoingCall ? false : true),
        onCall: ((bg.isOnOutgoingCall || bg.onCall) ? true : false),
        gettingCall: (bg.isIncomingCall ? true : false),
        isReservationAvailable: bg.isOnReservation,
        reservation: bg.currentReservation ? bg.currentReservation : this.state.reservation,
        isIncomingCall: bg.isIncomingCall ? bg.isIncomingCall : this.state.isIncomingCall,
        deviceSetupReady: (bg.deviceSetupReady ? true : this.state.deviceSetupReady),
        deviceOffline: bg.deviceOffline,
        muteValue: bg.muteValue,
        totalSeconds: bg.totalSeconds,
        staticNumber: bg.outgoingConnection?.message?.phoneNumber,
        // errLoginMsg: (bg.deviceOffline ? 'Device is offline Please login again or Contact Support Team' : '')
      })

      if (bg.outgoingConnection) {
        // document.getElementById('mute_dialpad').style.display = 'block';
        // document.getElementById('dial_keypad_box').style.display = 'none';
        // document.getElementById('hide_button').style.display = "none";
        // document.getElementById("phone").disabled = true;
        // document.getElementById('phone').style.backgroundColor = "lightgrey";
        // document.getElementById("phoneNumber").disabled = true;
        // document.getElementById('phoneNumber').style.backgroundColor = "lightgrey";
        // outgoingConnection = bg.outgoingConnection;
        if (bg.outgoingConnection && bg.outgoingConnection.message && bg.outgoingConnection.message.phoneNumber) {
          console.log(bg.outgoingConnection.message.phoneNumber);
          
          // setDialNumber(outgoingConnection.message.phoneNumber);
        }
        // document.getElementById('showTimer').style.display = 'block';
        // if (bg.isonOutgoingCall) {
        //   totalSeconds = bg.totalSeconds;
        //   callTimer = setInterval(setTime, 1000);
        // }
        // showHideCallButtons('h');
        console.log('showHideCallButtons to show hangup for existing outgoing conn');
      } else {
        // document.getElementById("phone").disabled = false;
        // document.getElementById('phone').style.backgroundColor = "";
      }
    }

    componentWillUnmount() {
      chrome.runtime.onMessage.removeListener(this.handleMessage);
    }

    handleOnChange(value, data, event, formattedValue) {
      const number = value.slice(data.dialCode.length);
      this.setState({phone: value, rawPhone: number, dialCode: '+' + data.dialCode});
    }

    onDialKeyPress(key) {
      const stdCode = this.state.dialCode;
      if (this.state.phone.includes(stdCode.substring(1))) {
        this.setState({phone: this.state.phone.concat(key), rawPhone: this.state.rawPhone.concat(key)});
      } else {
        this.setState({phone: this.state.phone.concat(stdCode + key), rawPhone: this.state.rawPhone.concat(key)});
      }
    }

    onReload() {
      this.setState({phone: this.state.phone.replace(this.state.rawPhone, '') ,rawPhone: ''});
    }

    onBackSpaceKeyPress() {
      if (this.state.rawPhone.length > 0) {
        this.setState({phone: this.state.phone.slice(0, -1), rawPhone: this.state.rawPhone.slice(0, -1)})
      }
    }

    onRejectCall() {
      // setDialNumber('');
      // clearInterval(callTimer);
      chrome.runtime.sendMessage({ output: 'Rejected' });
      // document.getElementById('dial_keypad_box').style.display = 'block';
      // document.getElementById('dial_inputnumber').style.display = 'block';
      this.setState({isCallAccepted: false, onCall: false, makeCall: true, gettingCall: false, showDialPad: true});
    }

    onAcceptCall() {
      // clearInterval(callTimer);
      // resetTimer();
      chrome.runtime.sendMessage({ output: 'Accepted' });
      this.setState({isCallAccepted: true, onCall: true, makeCall: false, gettingCall: false, showDialPad: true});
      // document.getElementById('showTimer').style.display = 'block';
      // document.getElementById('mute_dialpad').style.display = 'block';
      // console.log('Set Timer called from incoming call accept');
      // callTimer = setInterval(setTime, 1000);
      // showHideCallButtons('h');
      console.log('showHideCallButtons to show hangup on call_accept');
    }

    onCallClick() {
      // console.log(chrome.extension.getBackgroundPage().isUserAuthenticated);
      console.log(chrome.extension.getBackgroundPage());
      console.log('dialed number ' + this.state.rawPhone + ' full no ' + this.state.phone);
      if (this.state.rawPhone && this.state.rawPhone.length > 0) {
        var outgoingObject = {
          number: this.state.rawPhone,
          isoCode: ((this.props?.geoData?.country_code) ? this.props.geoData.country_code : 'in'),
          countryCode: ((this.state.dialCode) ? this.state.dialCode : '+91')
        };      
        chrome.runtime.sendMessage({outgoingObj: outgoingObject});
        // resetTimer();
        // document.getElementById('showTimer').style.display = 'block';
        // if (!fullNumber) {
        //   setDialNumber(document.getElementById('phoneNumber').value);
        // }
        // console.log('INFO', 'Calling ' + fullNumber);
        this.setState({
          makeCall: false,
          onCall: true,
          gettingCall: false,
          isOnOutgoingCall: true,
          staticNumber: this.state.dialCode + this.state.rawPhone
        });
      }
    }

    onHangUpClick() {
      // document.getElementById("phone").disabled = false;
      // document.getElementById('phone').style.backgroundColor = "";
      // document.getElementById("phoneNumber").disabled = false;
      // document.getElementById('phoneNumber').style.backgroundColor = "";
      // if (callTimer) {
      //   clearInterval(callTimer);
      // }
      console.log(this.state.deviceView);
      // this.state.deviceView.device.disconnectAll();
      chrome.runtime.sendMessage({ output: 'OnHangUp' });
      this.setState({
        phone: this.state.phone.slice(0, -(this.state.rawPhone.length)),
        makeCall: true, 
        onCall: false, 
        gettingCall: false,
        rawPhone: '',
        showDialPad: true,
        isOnOutgoingCall: false
      });
      // showHideElement([
      //   { name: 'dial_keypad_box', flag: true },
      //   { name: 'dial_inputnumber', flag: true },
      //   { name: 'outgoingCallBox', flag: true },
      //   { name: 'incomingCallBox', flag: false },
      //   { name: 'showTimer', flag: false },
      //   { name: 'mute_dialpad', flag: false }
      // ]);
      // isOnOutgoingCall = false;
      // document.getElementById("signOutSection").style.backgroundColor = "";
    }

    onToggleDialPad() {
      this.setState({showDialPad: !this.state.showDialPad});
    }

    render() {
        return (
            <div className="midblock dialPadMainBox customScrollY" id="spageInit();how_dialpad">
                 <div className="keys" id="dialpad">
                    <div className="numberBox" id="dial_inputnumber">
                      <div id='incomingCallBox' className="callArea"  style={{ display: (!this.state.makeCall ? 'block' : 'none') }}>
                        <span className="inputNumber" id="incomingphoneNumber">{this.state.staticNumber}</span>
                      </div>
                      <div id='outgoingCallBox' className="callArea" style={{ display: (this.state.makeCall ? 'block' : 'none') }}>
                        <table cell-padding="4">
                          <tbody>
                            <tr>
                              <td style={{display: 'inline-flex'}}>
                                <div style={{display: 'inline-flex', width:'65%',border:'1px solid #DCDCDC'}}>
                                <PhoneInput
                                  country={(this.props.geoData) ? this.props?.geoData?.country_code?.toLowerCase() : 'in'}
                                  value={this.state.phone}
                                  onChange={this.handleOnChange}
                                  // onChange={this.onNumberChange.bind(this)}
                                  // onChange={phone => this.setState({ phone })}
                                  countryCodeEditable={false}
                                  // autoFocus={true}
                                  inputProps={{
                                    required: true,
                                    autoFocus: true
                                  }}
                                />
                                </div>
                                {/* <input type="text" autoComplete="off" className="inputNumber" maxLength="12" id="phoneNumber" defaultValue='' /> */}
                              </td>
                            </tr>
                          </tbody>
                        </table> 
                      </div>                
                      <span id="showTimer" style={{ display: (this.state.onCall ? 'block' : 'none') }}><label id="minutes">00</label>:<label id="seconds">00</label></span>
                    </div>
                    <div>
                      <div className="numberBtnBox">
                        <div id="dial_keypad_box" style={{ display: ((this.state.showDialPad && !this.state.gettingCall) ? 'block' : 'none') }}>
                          <div className="key-row">
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(1)}>1<span></span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(2)}>2<span>abc</span> </button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(3)}>3<span>def</span></button>
                          </div>
                          <div className="key-row">
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(4)}>4<span>ghi</span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(5)}>5<span>jkl</span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(6)}>6<span>mno</span></button>
                          </div>
                          <div className="key-row">
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(7)}>7<span>pqrs</span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(8)}>8<span>Tuv</span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(9)}>9<span>wxyz</span></button>
                          </div>
                          <div className="key-row">
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress('*')}>*</button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress(0)}>0<span>+</span></button>
                            <button className="btn btn-circle btn-default keypad" onClick={() => this.onDialKeyPress('#')}>#</button>
                          </div>
                        </div>
                        <div id="mute_dialpad" style={{ display: (!this.state.showDialPad ? 'block' : 'none') }}>
                            <div className="muteScreen mute_dialkeypad" >
                            <div className="key-row">
                                <button className={"btn btn-circle btn-default callignored " + (this.state.muteValue ? 'active' : '')}><span className="mute"></span></button>
                                <button className="btn btn-circle btn-default" onClick={this.onToggleDialPad}><span className="keybardIcon"></span> </button>
                            </div>
                            </div>
                        </div>
                      </div>
                      <div id="resetdialdelete" style={{ display: (this.state.makeCall ? 'block' : 'none') }}>
                        <div className="key-row dialAction">
                          <button className="btn" id="reload_active">
                            {(this.state.rawPhone && this.state.rawPhone.length > 0 )
                              ? <img src={reloadImg} alt="reload" onClick={this.onReload} className="reset_DialPad"></img>
                              : <span className="reset"></span>
                            }                            
                          </button>
                          <button className="btn" onClick={this.onCallClick}><span className="dial calling_button"></span></button>
                          <button className="btn" id="active_backspace">
                          {
                            (this.state.rawPhone && this.state.rawPhone.length > 0 )
                              ? <span><img src={deleteImg} alt="" onClick={this.onBackSpaceKeyPress} className="deletekey"></img></span>
                              : <span className="deleteNumber"></span>
                          } 
                          </button>
                        </div>
                      </div>
                      
                        <div id="disconnecthide" style={{ display: (this.state.onCall ? 'block' : 'none') }}>
                            <div className="key-row dialAction dialAction2">
                                <button className="btn"></button>
                                <button className="btn" onClick={this.onHangUpClick}><span className="disconnect"></span></button>
                                <button className="btn hidetxt" style={{ display: (this.state.showDialPad ? 'block' : 'none')}} onClick={this.onToggleDialPad} id="hide_button"> Hide </button>
                            </div>
                        </div>
                      <div id="declineaccept" style={{ display: (this.state.gettingCall ? 'block' : 'none') }}>
                        <div className="key-row dialAction incomig-bx" >
                          <button className="btn" id="disconnect" onClick={this.onRejectCall}><span className="disconnect"></span> Decline</button>
                          <button className="btn" onClick={this.onAcceptCall} id="acceptCall"><span className="dial" ></span> Accept</button>
                        </div>
                      </div>
                    </div>
                </div>  
            </div>
        )
    }

}

export default DialPad;
