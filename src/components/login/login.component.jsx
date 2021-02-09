/*global chrome*/

import React, { Component }  from  'react';

import {Global} from '../globalvariable/golbal.component';

import './login.styles.css';

const axios = require('axios').default;

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'rakesh.kumar+twilio@builder.ai',
            password: '12345678'
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.geoData = {};
    }

    getGeoInfo = () => {
        // axios.get('https://extreme-ip-lookup.com/json/')
        //     .then(response => {
        //         this.geoData = response.data;
        //         // console.log(response);
        // })
        // .catch(e => {
        //     console.log(e);
        // });
        axios.get('https://ipinfo.io/json?token=b95957ab545c08')
            .then(response => {
                this.geoData = response.data;
                // console.log(response);
        })
        .catch(e => {
            console.log(e);
        });
        // axios.get('https://ipapi.co/json/').then((response) => {
        //     console.log(response);
        //     this.geoData = response.data;
        // }).catch((error) => {
        //     console.log(error);
        // });
    };

    componentDidMount() {
        this.getGeoInfo();
    }

    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    submitHandler = e => {
        this.getGeoInfo();
        e.preventDefault();
        console.log(this.state);
        axios.post(process.env.REACT_APP_SignInUrl, this.state)
        .then(response => {
            const loginResponse = response.data.response.data;
            const userToken = loginResponse.access_token;
            if (userToken) {
                Global.isUserAuthenticated = true;
                var user = {
                    isUserAuthenticated: true,
                    token: userToken,
                    userID: loginResponse.user.id,
                    workerToken: loginResponse.worker_token,
                    offline_activity_sid: loginResponse.offline_activity_sid,
                    available_activity_sid: loginResponse.available_activity_sid   ,
                    geoData: this.geoData 
                  };
                  this.props.onSubmission(user);
                //   this.setState({userData: user});
                  Global.userData = user;
            } else {
                console.log('ERROR ', 'Please verify you email!');
            }
            chrome.runtime.sendMessage({ userAuthentication: user });
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        const { email, password } = this.state;

        return (
            <div className='login'>
                <form onSubmit={this.submitHandler}>
                    <div className='loginBox screen1'>
                    <h1 className='title'> Welcome,<br/> Login to Builder Dial</h1>
                    <div><label id='errLoginMsg' style={{color: 'red'}}></label></div>
                        <div className='inputBlock'>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="text" 
                                    name='email' 
                                    id="loginEmail" 
                                    placeholder="firstname.lastname@builder.ai" 
                                    value={email}
                                    onChange= {this.changeHandler} 
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password </label>
                                <input 
                                    type="password" 
                                    name='password' 
                                    id="loginPassword"  
                                    className="password" 
                                    value={password}
                                    onChange= {this.changeHandler} 
                                />
                            </div>
                        </div>
                        <div className="actionBox">
                            <button 
                            className="brandbtn signIn"
                            type="submit" 
                            value="SignIn">Login </button>
                        </div>
                    </div>
                </form>

            </div>
        )
    }

}

export default Login;

// export const Login = props => {
//      // handle button click of login form
//   const handleLogin = () => {
//     props.history.push('/dashboard');
//   }

//     return(
//       <div className='login customScrollY'>
//         <div>
//             <div className='loginBox screen1'>
//             <h1 className='title'> Welcome,<br/> Login to Builder Dial</h1>
//             <div><label id='errLoginMsg' style={{color: 'red'}}></label></div>
//             <div className='inputBlock'>
//                 <div>
//                     <label htmlFor="email">Email</label>
//                     <input type="text" id="loginEmail" placeholder="firstname.lastname@builder.ai" />
//                 </div>
//                 <div>
//                     <label htmlFor="password">Password </label>
//                     <input type="password" id="loginPassword"  className="password" />
//                 </div>
//             </div>
//                 <div className="actionBox">
//                     <button className="brandbtn signIn" onClick={handleLogin} type="submit" value="SignIn">Login </button>
//                 </div>
//         </div>
//         </div>
//       </div>
//     )
// }