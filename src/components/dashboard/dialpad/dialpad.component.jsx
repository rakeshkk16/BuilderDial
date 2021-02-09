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
          phone: "" ,
          rawPhone: "",
          callingCode: ''
        };
      this.onCallClick = this.onCallClick.bind(this);
      this.handleOnChange = this.handleOnChange.bind(this);
      this.onReload = this.onReload.bind(this);
      this.onBackSpaceKeyPress = this.onBackSpaceKeyPress.bind(this);
      this.onDialKeyPress = this.onDialKeyPress.bind(this);
      this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    // onNumberChange(value, data) {
    //   console.log(value);
    //   console.log(data);
    //   const number = value.slice(data.dialCode.length);
    //   console.log(number);
    //   this.setState(
    //     {phone: value, rawPhone: number}, 
    //     () => console.log(this.state.phone + ' ' + this.state.rawPhone)
    //   );
    // }

    handleOnChange(value, data, event, formattedValue) {
      // console.log(value);
      // console.log(data);
      const number = value.slice(data.dialCode.length);
      // console.log(number);
      this.setState(
        {
          callingCode: '+' + data.dialCode,phone: value, rawPhone: number
        }, 
        () => {
          console.log(this.state.phone + ' ' + this.state.callingCode + ' ' + this.state.rawPhone)
        }
      );
    }

    onDialKeyPress(key) {
      const stdCode = this.state.callingCode;
      console.log('key press ' + stdCode);
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

    onCallClick() {
      // console.log(chrome.extension.getBackgroundPage().isUserAuthenticated);
      console.log(chrome.extension.getBackgroundPage());
      console.log('dialed number ' + this.state.rawPhone);
      if (this.state.rawPhone && this.state.rawPhone.length > 0) {
        var outgoingObject = {
          number: this.state.rawPhone,
          isoCode: ((this.props?.geoData?.countryCode) ? this.props.geoData.countryCode.toLowerCase() : 'in'),
          countryCode: ((this.state.callingCode) ? this.state.callingCode : '+91')
        };      
        chrome.runtime.sendMessage({outgoingObj: outgoingObject});
        // resetTimer();
        // document.getElementById('showTimer').style.display = 'block';
        // if (!fullNumber) {
        //   setDialNumber(document.getElementById('phoneNumber').value);
        // }
        // console.log('INFO', 'Calling ' + fullNumber);
        // showHideCallButtons('h');
        // console.log('showHideCallButtons to show hangup after calling_button is pressed');
      }
    }
    checkAuthentication() {
      console.log(this.props);
      chrome.storage.local.get(null, (data) => {
        console.log(data);
        // this.setState({isUserAuthenticated: data.data.name});
     });
      //  chrome.storage.local.get(['name'], function (result) {
      //       console.log(result);
      //   });
      // var bg = chrome.extension.getBackgroundPage();
      // console.log(bg);
      // console.log('dialpage auth ' + bg.isUserAuthenticated);
  }

    render() {
        return (
            <div className="midblock dialPadMainBox customScrollY" id="spageInit();how_dialpad">
                 <div className="keys" id="dialpad">
                    <div className="numberBox" id="dial_inputnumber">
                      <div id='incomingCallBox' className="callArea" style={{display: 'none'}}>
                        <span className="inputNumber" id="incomingphoneNumber"></span>
                      </div>
                      <div id='outgoingCallBox' className="callArea">
                        <table cell-padding="4">
                          <tbody>
                            <tr>
                              <td style={{display: 'inline-flex'}}>
                                <div style={{display: 'inline-flex', width:'65%',border:'1px solid #DCDCDC'}}>
                                <PhoneInput
                                  country={(this.props.geoData) ? this.props?.geoData?.countryCode?.toLowerCase() : 'in'}
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
                      <span id="showTimer" style={{display: 'none'}}><label id="minutes">00</label>:<label id="seconds">00</label></span>
                    </div>
                    <div>
                      <div className="numberBtnBox">
                        <div id="dial_keypad_box">
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
                        <div id="mute_dialpad" style={{display: 'none'}}>
                            <div className="muteScreen mute_dialkeypad" >
                            <div className="key-row">
                                <button className="btn btn-circle btn-default callignored"><span className="mute"></span></button>
                                <button className="btn btn-circle btn-default show_dialkeypad"><span className="keybardIcon"></span> </button>
                            </div>
                            </div>
                        </div>
                      </div>
                      <div id="resetdialdelete">
                        <div className="key-row dialAction">
                          {/* <button className="btn" id="reload_inactive"><span className="reset"></span></button> */}
                          <button className="btn" id="reload_active">
                            {(this.state.rawPhone && this.state.rawPhone.length > 0 )
                              ? <img src={reloadImg} alt="reload" onClick={this.onReload} className="reset_DialPad"></img>
                              : <span className="reset"></span>
                            }                            
                          </button>
                          <button className="btn" onClick={this.onCallClick}><span className="dial calling_button"></span></button>

                          {/* <button className="btn" id="backspace" style={{marginRight: '5px'}}>
                            <span className="deleteNumber"></span>
                          </button> */}
                          <button className="btn" id="active_backspace">
                          {
                            (this.state.rawPhone && this.state.rawPhone.length > 0 )
                              ? <span><img src={deleteImg} alt="" onClick={this.onBackSpaceKeyPress} className="deletekey"></img></span>
                              : <span className="deleteNumber"></span>
                          } 
                          </button>
                        </div>
                      </div>
                      
                      <div id="disconnecthide" style={{display: 'none'}}>
                            <div className="key-row dialAction dialAction2">
                                <button className="btn"></button>
                                <button className="btn"><span className="disconnect hangup_button"></span></button>
                                <button className="btn hidetxt hide_dialpad" id="hide_button"> Hide </button>
                            </div>
                        </div>
                      <div id="declineaccept" style={{display: 'none'}}>
                      <div className="key-row dialAction incomig-bx" >
                        <button className="btn call_decline" id="disconnect"><span className="disconnect"></span> Decline</button>
                        <button className="btn call_accept" id="acceptCall"><span className="dial" ></span> Accept</button>
                      </div>
                    </div>
                    </div>
                </div>  
            </div>
        )
    }

}

export default DialPad;
