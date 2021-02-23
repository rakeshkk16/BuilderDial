import React, {Component} from  'react';

import './callrecord.styles.css';

import callbutton from '../../../images/call_button.svg';
import playbutton from  '../../../images/play_button.svg';
import voicemailplayed from '../../../images/played_voicemail_button.svg';
import voicemailunplayed from "../../../images/unplayed_voicemail_button.svg";

const axios = require('axios').default;

export class CallRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showHideDetailBox: false,
            myAudio : new Audio()
        }
        this.toggleDetailBox = this.toggleDetailBox.bind(this);
        this.onCallClick = this.onCallClick.bind(this);
        this.onPlayRecording = this.onPlayRecording.bind(this);
        this.updateCallRecord = this.updateCallRecord.bind(this);
    }

    componentDidMount() {
    }

    onCallClick(evt) {
        evt.stopPropagation();
        this.updateCallRecord(evt, true);
        console.log('Call Clicked');
        let fullNumber = this.props.call.client_number;
        let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
        let number = phoneUtil.parseAndKeepRawInput(this.props.call.client_number, '');
        let stdCode = '+' + number.getCountryCode();
        let rawPhone = fullNumber.replace(stdCode, '');
        var outgoingObject = {
            number: rawPhone,
            isoCode: (phoneUtil.getRegionCodeForNumber(number).toLowerCase()),
            countryCode: stdCode
        };
        this.props.onCallClicked(outgoingObject);        
    }

    onPlayRecording(evt) {
        evt.stopPropagation();
        console.log('Recording Played');
        this.setState({myAudio: new Audio(this.props.call.recording_url)}, ()=> this.state.myAudio.play());
        this.updateCallRecord(evt, false);
    }

    updateCallRecord(e, isCalled) {
        e.preventDefault();
        let data = {};
        if (isCalled) {
            data = { id: this.props.call.id}
        } else {
            data = { id: this.props.call.id, voicemail_played: true }
        }
        console.log(process.env.REACT_APP_missedCallAction);
        console.log(data);
        axios.post('https://staging-pb.engineer.ai/api/public/call/missed_call_action', data, {
            headers: {"Authorization": 'Bearer ' + this.props.token}
        })
        .then(response => {
            console.log(response);                   
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.data.response.message);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log(error);
            }
        })
    }

    toggleDetailBox(e) {
        console.log('toggle called ' + this.state.showHideDetailBox + ' ' + this.props.call.id + ' ' + this.props.sectionID);
        this.setState({
            showHideDetailBox: ((this.state.showHideDetailBox && (this.props.sectionID !== this.props.call.id)) ? true : !this.state.showHideDetailBox)
        }, ()=> {
            if (this.state.showHideDetailBox) {
                this.props.handler(this.props.call.id);
            }
        });    
    }

    render() {
        return(
            <li onClick={this.toggleDetailBox} style={{backgroundColor: (this.state.showHideDetailBox && (this.props.sectionID === this.props.call.id)) ? 'lightgrey' : '' }}>
               <div className="callListBox" id={this.props.call.id}>
                   <div className="leftBx">
                       <div className={"callArrow " + ((this.props.call.status !== 'completed') ? 'missed' : (this.props.call.call_type === 'outbound') ? 'outgoing' : 'incoming')}></div>
                       <div className="numberBx" style={{color: ((this.props.call.status !== 'completed') ? '#E01717' : null), fontWeight: ((this.props.call.status !== 'completed') ? ((!this.props.call.actioned_by) ? 'bold' : '') : '')}}>
                           {this.props.call.client_number}
                           <span>{this.props.call.call_duration}</span>
                       </div>
                   </div>
                   <div className="rightBx">{this.props.call.call_date}</div>
               </div>
                {/* <div className="callDetailsBox" style={{display: this.showHideDetail() ? 'block' : 'none'}}> */}
                <div className="callDetailsBox" style={{display: (this.state.showHideDetailBox && (this.props.sectionID === this.props.call.id)) ? 'block' : 'none'}}>
                {/* <p style="color: black; letter-spacing: -0.01em; font-size: 14px; margin: 15px 0px 0px;">{props.call.contact_name}</p> */}
                    <p>{this.props.call.contact_name}</p>
                    <button className="callingBox" onClick={this.onCallClick}>
                        <img alt='' src={callbutton}></img>
                    </button>
                    {   (this.props.call.recording_url !== null) 
                        ?   <button onClick={this.onPlayRecording}>
                                {
                                    (this.props.call.status !== 'completed')
                                    ? (
                                        (this.props.call.voicemail_played_by) 
                                        ? <img alt='' src={voicemailplayed}></img>
                                        : <img alt='' src={voicemailunplayed}></img>
                                    )
                                    : <img alt='' src={playbutton}></img>
                                }
                            </button>
                        : null
                    }
                </div>
            </li>    
        )
    }

}

export default CallRecord;


// export const CallRecord = props => {
//     return(
//         <li>
//            <div className="callListBox" id={props.call.id} onClick={this.toggleDetailBox}>
//                <div className="leftBx">
//                    <div className={"callArrow " + ((props.call.recording_url === null) ? 'missed' : (props.call.call_type === 'outbound') ? 'outgoing' : 'incoming')}></div>
//                    <div className="numberBx" style={{color: (props.call.recording_url === null) ? '#E01717' : null}}>
//                        {props.call.client_number}
//                        <span>{props.call.call_duration}</span>
//                        {/* <input type="hidden" name="id_2591" value="2591"> */}
//                    </div>
//                </div>
//                <div className="rightBx">{props.call.call_date}</div>
//            </div>
//            <div className="callDetailsBox" style={{display: (1===2) ? 'block' : 'none' }}>
//            {/* <p style="color: black; letter-spacing: -0.01em; font-size: 14px; margin: 15px 0px 0px;">{props.call.contact_name}</p> */}
//            <p>{props.call.contact_name}</p>
//            <button className="callingBox">
//                <img alt='' src={callbutton}></img>
//            </button>
//            <button>
//                {(props.call.recording_url === null)
//                 ? (
//                     (props.call.status === 'completed') 
//                     ? <img alt='' src={voicemailplayed}></img>
//                     : <img alt='' src={voicemailunplayed}></img>
//                   )
//                 : <img alt='' src={playbutton}></img>
//                }
//                 {/* <img src= {(props.call.recording_url === null) ? () : '../../../images/play_button.svg'}></img> */}
//            </button>
//            </div>
//         </li>

//         // <li>
//         //     <div class="callListBox" id="2591">
//         //         <div class="leftBx">
//         //             <div class="callArrow missed">
//         //             </div>
//         //             <div class="numberBx" style="color: rgb(224, 23, 23);">+919039908593<span>00:00</span>
//         //                 <input type="hidden" name="id_2591" value="2591">
//         //             </div>
//         //         </div>
//         //         <div class="rightBx">14:06</div>
//         //     </div>
//         //     <div class="callDetailsBox" style="display: none;">
//         //         <p style="color: black; letter-spacing: -0.01em; font-size: 14px; margin: 15px 0px 0px;">seventeen buildcard testing</p>
//         //         <button class="callingBox">
//         //             <img src="images/call_button.svg">
//         //         </button>
//         //         <button class="viewedVoicemailPlayButton">
//         //             <img src="images/played_voicemail_button.svg">
//         //         </button>
//         //     </div>
//         // </li>

//     )
// }