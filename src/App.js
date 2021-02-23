/*global chrome*/
import React, { Component, useState, useEffect} from 'react';
import './App.css';
import logo from './images/Logo.png';
import {HomePage} from './components/homepage/homepage.component';

export default function App() {
  // const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const onClick = () => {
    window.close();
  };
  // useEffect(() => {

  //   // chrome.storage.local.get(null, (data) => {
  //   //     console.log('Data fetched from chrome ' + data.name);
  //   //     setIsUserAuthenticated(data.name);
  //   //  });
  // },[])

  // useEffect(() => {
  //   console.log('check auth ' + isUserAuthenticated);
  // },[isUserAuthenticated])

  return (
    <div className="App">
        <div className="main">
          <div className="header">
            <img src={logo} alt="Logo" />
            <button type="button" onClick={() => onClick()} className="close close_extension" style={{cursor: 'pointer'}}> x </button>
          </div>
          <HomePage></HomePage>
        </div>
    </div>
  );
}
// class App extends Component {
//   constructor() {
//     super();

//     this.state = {
//       isUserAuthenticated: false,
//       userData: ''
//     }

//     chrome.storage.local.get(null, (data) => {
//       console.log('Data fetched from chrome ' + data.name);
//       this.setState({isUserAuthenticated: data.name});
//       console.log(this.state);
//    });
//   }

//   onClose = () => {
//     window.close();
//   }

//   componentDidMount() { 
//   }

//   render() {
//     return (
//       <div className="App">
//          <div className="main">
//             <div className="header">
//               <img src={logo} alt="Logo" />
//               <button type="button" onClick={this.onClose} className="close close_extension" style={{cursor: 'pointer'}}> x </button>
//             </div>
//             <HomePage isValid={this.state.isUserAuthenticated}></HomePage>
//           </div>
//       </div>
//     );
//   }

// }

// export default App;

// class App extends Component {
//   render() {
//     return (
//       <div classNameName="App">``
//       <div id="loaded">
//         <div id="offline" style={{display: 'none'}}>Please contact support team <br/> as your device is offline.</div>
//         <div classNameName="main">
//           <div classNameName="header">
//             <img src="images/Logo.png" alt="logo" />
//             <button type="button" classNameName="close close_extension" style={{cursor:'pointer'}}> x </button>
//           </div>
    
//           <div classNameName="midblock customScrollY" id="authScreens">
//               <div >
//                 <form id="authForm">  
//                   <div style={{display: 'none'}} id="loginScreen" className="loginBox screen1" > 
//                     <h1 classNameName="title">Welcome,<br/> Login to Builder Dial</h1>
//                     <div><label id="errLoginMsg" style={{color:'red'}}></label></div>
//                     <div classNameName="inputBlock">
//                       <div>
//                         <label for="email">Email</label>
//                         <input type="text" id="loginEmail" placeholder="firstname.lastname@builder.ai" />
//                       </div>
//                       <div>
//                         <label for="password">Password </label>
//                         <input type="password" id="loginPassword"  className="password" />
//                       </div>
//                     </div>
//                     <div className="actionBox">
//                         <button className="brandbtn signIn" type="submit" value="SignIn">Login </button>
//                     </div>
//                   </div>

//                 </form>
//                 <form id="changePwdForm">  
//                   <div style={{display: 'none'}} id="changepwdscreen" className="loginBox" > 
//                     <h1 className="title">Change Password</h1>
//                     <div><label id="errPasswordMsg" style={{color:'red'}}></label></div>
//                     <div className="inputBlock">
//                       <div>
//                         <label for="password">Current Password</label>
//                         <input type="password" id="currentPwd" className="password" value=""/>
//                       </div>
//                       <div>
//                         <label for="password">New Password</label>
//                         <input type="password" id="newPwd" className="password" value=""/>
//                       </div>
//                       <div>
//                         <label for="password">Confirm Password</label>
//                         <input type="password" id="confirmPwd" className="password" value=""/>
//                       </div>
//                     </div>
//                     <div className="actionBox">
//                         <button className="brandbtn resetPwd" type="submit">Save </button>
//                     </div>
//                   </div>   
//                 </form>         
//                 <form id="activationForm">
//                   <div style={{display: 'none'}} className="loginBox screen2"> 
//                     <div className="inputBlock">
//                       <div>
//                         <label for="email">Activation Code</label>
//                         <input type="text" id="email" placeholder="" />
//                         <div className="extra-msg">Didn't receive code? <span>Resend Code</span></div>
//                       </div>
//                     </div>
//                     <div className="actionBox">
//                         <button className="brandbtn" type="submit" value="SignIn">Login </button>
//                         <p className="extra-msg"> Don't have an account? <span>Get Started</span></p>
//                     </div>
//                   </div>
//                 </form>         
//                 <form id="registrationForm"> 
//                   <div style={{display: 'none'}} id="registrationScreen" className="loginBox regScreen" > 
//                     <h1 className="title">Get Started,<br/> Signup for Builder Dial</h1>
//                     <div><label id="errRegMsg" style={{color:'red'}}></label></div>
//                     <div className="inputBlock">
//                       <div>
//                         <label for="firstname">First Name</label>
//                         <input type="text" id="registeredFirstName" placeholder="Firstname" />
//                       </div>
//                       <div>
//                         <label for="lastname">Last Name</label>
//                         <input type="text" id="registeredLastName" placeholder="Last Name" />
//                       </div>
//                       <div>
//                         <label for="email">Email</label>
//                         <input type="text" id="registeredEmail" placeholder="firstname.lastname@builder.ai" />
//                       </div>
//                       <div>
//                         <label for="password">Password</label>
//                         <input type="password" id="registeredPassword" className="password" />
//                       </div>
//                       <div>
//                         <label for="confprmpassword">Confirm Password</label>
//                         <input type="password" id="confprmpassword" className="password" />
//                       </div>
//                     </div>
//                     <div className="actionBox">
//                         <button className="brandbtn signUp" type="submit" value="SignUp">Signup </button>
//                         <p className="txt"> Already have an account? <span className="extra-msg showLogin">Login</span></p>
//                     </div>
//                   </div>
//                 </form>      
//               </div>
//           </div>

//               <div id="onLogOut">
//                 <div className="midblock dialPadMainBox customScrollY" id="show_dialpad">
//                   <div className="keys" id="dialpad">
//                     <div className="numberBox" id="dial_inputnumber">
//                       <div id='incomingCallBox' className="callArea" style={{display: 'none'}}>
//                         <span className="inputNumber" id="incomingphoneNumber"></span>
//                       </div>
//                       <div id='outgoingCallBox' className="callArea">
//                         <table cell-padding="4">
//                           <tbody>
//                             <tr>
//                               <td style={{display: 'inline-flex'}}>
//                                 <div style={{display: 'inline-flex', width:'65%',border:'1px solid #DCDCDC'}}>
//                                   <input id="phone" name="phone" type="tel" style={{width: '0px'}}/>
//                                   <input type="text" id="countryCode"  disabled/>
//                                 </div>
//                                 <input type="text" autocomplete="off" className="inputNumber" maxlength="12" id="phoneNumber" value="" />
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table> 
//                       </div>                
//                       <span id="showTimer" style={{display: 'none'}}><label id="minutes">00</label>:<label id="seconds">00</label></span>
//                     </div>
//                     <div>
//                       <div className="numberBtnBox">
//                         <div id="dial_keypad_box">
//                           <div className="key-row">
//                             <button className="btn btn-circle btn-default keypad">1<span></span></button>
//                             <button className="btn btn-circle btn-default keypad">2<span>abc</span> </button>
//                             <button className="btn btn-circle btn-default keypad">3<span>def</span></button>
//                           </div>
//                           <div className="key-row">
//                             <button className="btn btn-circle btn-default keypad">4<span>ghi</span></button>
//                             <button className="btn btn-circle btn-default keypad">5<span>jkl</span></button>
//                             <button className="btn btn-circle btn-default keypad">6<span>mno</span></button>
//                           </div>
//                           <div className="key-row">
//                             <button className="btn btn-circle btn-default keypad">7<span>pqrs</span></button>
//                             <button className="btn btn-circle btn-default keypad">8<span>Tuv</span></button>
//                             <button className="btn btn-circle btn-default keypad">9<span>wxyz</span></button>
//                           </div>
//                           <div className="key-row">
//                             <button className="btn btn-circle btn-default keypad">*</button>
//                             <button className="btn btn-circle btn-default keypad">0<span>+</span></button>
//                             <button className="btn btn-circle btn-default keypad">#</button>
//                           </div>
//                         </div>
//                         <div id="mute_dialpad" style={{display: 'none'}}>
//                         <div className="muteScreen mute_dialkeypad" >
//                           <div className="key-row">
//                             <button className="btn btn-circle btn-default callignored"><span className="mute"></span></button>
//                             <button className="btn btn-circle btn-default show_dialkeypad"><span className="keybardIcon"></span> </button>
//                           </div>
//                         </div>
//                       </div>
//                       </div>
//                       <div id="resetdialdelete" style={{display: 'none'}}>
//                         <div className="key-row dialAction">
//                           <button className="btn" id="reload_inactive"><span className="reset"></span></button>
//                           <button className="btn" id="reload_active" style={{display: 'none'}}><img src="images/reload.svg" alt="reload" className="reset_DialPad"></img></button>
//                           <button className="btn"><span className="dial calling_button"></span></button>

//                           <button className="btn" id="backspace" style={{marginRight: '5px'}}><span className="deleteNumber"></span></button>
//                           <button className="btn" id="active_backspace" style={{display: 'none'}}><span><img src="images/delete.svg" alt="" className="deletekey"></img></span></button>
//                         </div>
//                       </div>
                      
//                       <div id="disconnecthide" style={{display: 'none'}}>
//                         <div className="key-row dialAction dialAction2">
//                           <button className="btn"></button>
//                           <button className="btn"><span className="disconnect hangup_button"></span></button>
//                           <button className="btn hidetxt hide_dialpad" id="hide_button"> Hide </button>
//                       </div>
//                     </div>
//                       <div id="declineaccept" style={{display: 'none'}}>
//                       <div className="key-row dialAction incomig-bx" >
//                         <button className="btn call_decline" id="disconnect"><span className="disconnect"></span> Decline</button>
//                         <button className="btn call_accept" id="acceptCall"><span className="dial" ></span> Accept</button>
//                       </div>
//                     </div>
//                     </div>
//                     <div id="root"></div>
//                   </div>          
//                 </div>
//                 <div className="midblock" id="flag_change" style={{display: 'none'}}>
//                   <h2 style={{fontWeight: '600'}}><span style={{textAlign: 'left'}}>Country Selector</span></h2>
//                   <h4><span style={{textAlign: 'left'}}>Please select the country that you want to dial into and we would update the ISD code automatically to enable you to dial to the selected country.</span></h4>
//                   <table>
//                     <tbody>
//                       <tr>
//                         <td><input id="phone" name="phone" type="tel" style={{width: '0px',paddingLeft: '-10px'}}/></td>
//                         <td><button className="goToDialPad"><span style={{textAlign: 'right'}}>Select</span></button></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <table>
//                     <tbody>
//                     <tr><td><span>Country Name: </span></td><td style={{textAlignLast: "center"}}><span id="countryName"></span></td></tr>
//                     <tr><td><span>Country Code: </span></td><td style={{textAlignLast: "center"}} ><span id="countryCode"></span></td></tr>
//                     <tr><td><span>Country Dial Code: </span></td><td style={{textAlignLast: "center"}} ><span id="countryDialCode"></span></td></tr>
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="midblock customScrollY historymainBox" id="show_history_setting">
//                   <div className="historyBox" id="show_history">
//                     <div className="titile"> History </div>
//                     <div id="callHistoryList"></div>          
//                   </div>
//                   <div className="settingBox" id="show_setting">
//                     <div className="title"> Settings </div>
          
                  
//                     <div className="settingListing changePwd">
//                       <div className="infosection">
//                         <div className="setting-txt">Change Password</div>
//                         <div className="arrow"></div>
//                       </div>
//                     </div>
//                     <div className="settingListing" id="signOutSection">
//                       <div className="infosection">
//                         <div className="setting-txt">Sign Out</div>
//                         <div id="signOut" className="arrow signOut">
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>      
//           </div>
//           <div className="footer">
//             <p>&copy; 2020 Builder. All rights reserved.</p>
//           </div>
//           <div id="footer_navigation">
//             <div className="dialpad-footer">
//               <div className="ftrListing">
//                 <button type="button" className="show_history"> 
//                   <span className="history"></span> History
//                 </button>
//                 <button type="button" className="show_dialpad">
//                   <span className="dialkeypad"></span>Keypad
//                 </button>
//                 <button type="button" className="show_setting">  
//                   <span className="setting"></span>Settings
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     );
//   }
// }

// export default App;
