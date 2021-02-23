import React, { Component }  from  'react';

import './callhistory.styles.css';

import {CallRecord} from '../callrecord/callrecord.component';

import pageLoader from '../../../images/page-loader.gif';

const axios = require('axios').default;


export class CallHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            callList: [],
            sectionID: '',
            fetchInProgress: false
        }
        this.callFromCallHistory = this.callFromCallHistory.bind(this);
        this.handler = this.handler.bind(this)
    }

    componentDidMount() {
        this.setState({fetchInProgress : true});
        const data = this.props.userData;
        axios.get('https://staging-pb.engineer.ai/api/public/call/call_logs?timezone=' + data.geoData.timezone, {
            headers: {
                'Authorization': 'Bearer ' + data.token
            }
        })
        .then(res => {
            this.setState({fetchInProgress : false});
          const records = ((res.data.message === 'success') && res.data.data.calls && res.data.data.calls.length > 0) 
            ? res.data.data.calls
            : null;
          this.setState({callList: records});
        })
        .catch(error => {
            this.setState({fetchInProgress : false});
            console.log(error);
        })
    }

    callFromCallHistory(data) {
        this.props.callFromLogs(data);        
    }

    handler(id) {
        this.setState({
          sectionID: (id ? id : 0)
        })
    }

    componentWillUnmount() {
        this.props.callFromLogs('');
    }

    render() {
        return (
            <div className="midblock customScrollY historymainBox" id="show_history_setting">
                {(this.state.fetchInProgress)
                    ? <div id="loading">
                            <div class="pageLoader"><img alt="" src={pageLoader} /></div>
                        </div>
                    :  <div className="historyBox" id="show_history">
                            <div className="titile"> History </div>
                            <div id="callHistoryList" className="callHistoryList">
                                <ul className='callHistoryListing'>
                                    {this.state.callList.map(call => (
                                        <CallRecord key={call.id} token={this.props.userData.token} handler = {this.handler} sectionID={this.state.sectionID} call={call}  onCallClicked={this.callFromCallHistory}></CallRecord>
                                    ))}
                                </ul>                    
                            </div>
                        </div>
                }
            </div>
        )
    }

}

export default CallHistory;
