import React, { Component }  from  'react';

import './callhistory.styles.css';

import {CallRecord} from '../callrecord/callrecord.component';

const axios = require('axios').default;


export class CallHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            callList: []
        }
    }

    componentDidMount() {
        const data = this.props.userData;
        axios.get('https://staging-pb.engineer.ai/api/public/call/call_logs?timezone=' + data.geoData.timezone, {
            headers: {
                'Authorization': 'Bearer ' + data.token
            }
        })
        .then(res => {
          const records = ((res.data.message === 'success') && res.data.data.calls && res.data.data.calls.length > 0) 
            ? res.data.data.calls
            : null;
          console.log(records);
          this.setState({ callList: records });
        })
        .catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className="midblock customScrollY historymainBox" id="show_history_setting">
                <div className="historyBox" id="show_history">
                    <div className="titile"> History </div>
                    <div id="callHistoryList" className="callHistoryList">
                        <ul className='callHistoryListing'>
                            {this.state.callList.map(call => (
                                <CallRecord key={call.id} call={call}></CallRecord>
                            ))}
                        </ul>                    
                    </div>
                </div>
            </div>
        )
    }

}

export default CallHistory;
