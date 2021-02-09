import React from  'react';

import './callrecord.styles.css';

import callbutton from '../../../images/call_button.svg';
import playbutton from  '../../../images/play_button.svg';
import voicemailplayed from '../../../images/played_voicemail_button.svg';
import voicemailunplayed from "../../../images/unplayed_voicemail_button.svg";


export const CallRecord = props => {
    return(
        <li>
           <div className="callListBox" id={props.call.id}>
               <div className="leftBx">
                   <div className={"callArrow " + ((props.call.recording_url === null) ? 'missed' : (props.call.call_type === 'outbound') ? 'outgoing' : 'incoming')}></div>
                   <div className="numberBx" style={{color: (props.call.recording_url === null) ? '#E01717' : null}}>
                       {props.call.client_number}
                       <span>{props.call.call_duration}</span>
                       {/* <input type="hidden" name="id_2591" value="2591"> */}
                   </div>
               </div>
               <div className="rightBx">{props.call.call_date}</div>
           </div>
           <div className="callDetailsBox" style={{display: (1===2) ? 'block' : 'none' }}>
           {/* <p style="color: black; letter-spacing: -0.01em; font-size: 14px; margin: 15px 0px 0px;">{props.call.contact_name}</p> */}
           <p>{props.call.contact_name}</p>
           <button className="callingBox">
               <img alt='' src={callbutton}></img>
           </button>
           <button>
               {(props.call.recording_url === null)
                ? (
                    (props.call.status === 'completed') 
                    ? <img alt='' src={voicemailplayed}></img>
                    : <img alt='' src={voicemailunplayed}></img>
                  )
                : <img alt='' src={playbutton}></img>
               }
                {/* <img src= {(props.call.recording_url === null) ? () : '../../../images/play_button.svg'}></img> */}
           </button>
           </div>
        </li>

        // <li>
        //     <div class="callListBox" id="2591">
        //         <div class="leftBx">
        //             <div class="callArrow missed">
        //             </div>
        //             <div class="numberBx" style="color: rgb(224, 23, 23);">+919039908593<span>00:00</span>
        //                 <input type="hidden" name="id_2591" value="2591">
        //             </div>
        //         </div>
        //         <div class="rightBx">14:06</div>
        //     </div>
        //     <div class="callDetailsBox" style="display: none;">
        //         <p style="color: black; letter-spacing: -0.01em; font-size: 14px; margin: 15px 0px 0px;">seventeen buildcard testing</p>
        //         <button class="callingBox">
        //             <img src="images/call_button.svg">
        //         </button>
        //         <button class="viewedVoicemailPlayButton">
        //             <img src="images/played_voicemail_button.svg">
        //         </button>
        //     </div>
        // </li>

    )
}