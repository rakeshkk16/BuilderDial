
// (function() {
  var alertSound = new Audio("../sounds/telephone.mp3");
  var deviceView;
  var workerToken;
  var worker;
  var available_Activity_SID;
  var offline_Activity_SID;
  var userToken;
  var deviceOffline = false;
  var deviceSetupReady = false;
  var isUserAuthenticated = false;
  var deviceToken;
  var deviceConnection;
  var connectionObject;
  var deviceObject;
  var twilioConnection;
  var onCall = false;
  var outgoingConnection;
  var userID;
  var fullNumber;
  var isoCode;
  var countryCode;
  var isOnOutgoingCall = false;
  var isOnReservation = false;
  var currentReservation;
  var isIncomingCall = false;
  var totalSeconds = 0;
  var calledTimer;
  var iconChanger;
  var dialCode;
  var muteValue = false;

  const icons = {
    small: {
      '16': '../icons/16x16_small.png'
    },
    enabled: {
      '32': '../icons/BG48.png',
      '16': '../icons/BG16.png'
    },
    disabled: {
      '32': '../icons/B48.png',
      '16': '../icons/B16.png'
    },
    offline: {
      '32': '../icons/OF2.png',
      '16': '../icons/OF1.png'
    }
  };

 

  chrome.manifest = chrome.app.getDetails();

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason.search(/install/g) === -1) {
      return;
    }
    chrome.tabs.create({
      url: chrome.extension.getURL('/app/welcome.html'),
      active: true
    });
  });
  
  // function backgroundFunction () {
  //   var backgroundVariable = false;
  //   return "hello from the background!"
  // }

  /*global chrome*/
  console.log('background rendered ' + sessionStorage.getItem("reloaded"));
  if (sessionStorage.getItem('reloaded') != null) {
    console.log('page was reloaded');
  } else {
      console.log('page was not reloaded');
  }

  sessionStorage.setItem('reloaded', 'yes'); 
  // console.log(process.env);
  // Called when the user clicks on the browser action
  chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
  });

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {   
    if (request && request.output) {
      switch(request.output) {
        case 'Accepted':
          alertSound.pause();
          onCall = true;
          isIncomingCall = false;
          console.log(currentReservation.reservationStatus + '  ' + currentReservation.task.assignmentStatus);
          currentReservation.dequeue(
            currentReservation.task.attributes.caller,
            null,
            "record-from-answer",
            null,
            // eslint-disable-next-line no-undef
            environment.reservationDequeue,
             function(error, reservation) {
                if(error) {
                    console.log('Code :' + error.code + ' Message :' + error.message);
                    return;
                }
                console.log("reservation dequeued");
              }
            );

          calledTimer = setInterval(setTime, 1000);
          clearInterval(iconChanger);
          setTimeout(function(){ 
            chrome.browserAction.setIcon({path: icons.disabled});
          }, 1000);
          break;
        case 'Rejected':
          console.log(currentReservation);
          if (currentReservation) {
            currentReservation.reject(function(error, reservation) {
                  if(error) {
                    console.log('Code :' + error.code + ' ' + 'Message :' + error.message);
                      return;
                  }
                  console.log("reservation rejected");
                  for (var property in reservation) {
                      console.log(property+" : "+reservation[property]);
                  }
            });
          }
          
          alertSound.pause();
          clearInterval(iconChanger);
          setTimeout(function(){ 
            chrome.browserAction.setIcon({path: icons.disabled});
          }, 1000);
          console.log('popupjs rejected for Ongoing call as ' + onCall);
          chrome.runtime.sendMessage({output: 'callRejected'});
          if (onCall) {
            twilioConnection.disconnectAll();
          }
          onCall = false;
          break;
        case 'IncomingPopup':
          isIncomingCall = false;
          break;
        case 'OnHangUp':
          console.log('call Hangup');
          isOnOutgoingCall = false;
          deviceView.device.disconnectAll();

          outgoingConnection = null;
          onCall = false;
          clearInterval(calledTimer);
          console.log('call timer ' + calledTimer);
          resetTimer();
          break;
        default:
          break;
      }
    } else {
      if (request.userAuthentication) {
        console.log('user authenticated in background');
        console.log(request.userAuthentication);
        if(request.userAuthentication.isUserAuthenticated) {
          isUserAuthenticated = request.userAuthentication.isUserAuthenticated;
          workerToken = request.userAuthentication.workerToken;
          available_Activity_SID = request.userAuthentication.available_activity_sid;
          offline_Activity_SID = request.userAuthentication.offline_activity_sid;
          userToken = request.userAuthentication.token;
          userID = request.userAuthentication.userID;
          pageInit();
        } else {
          isUserAuthenticated = request.userAuthentication.isUserAuthenticated;
          console.log('not authenticated');
        }
      } else if (request.outgoingObj) {
          fullNumber = request.outgoingObj.number;
          isoCode = request.outgoingObj.isoCode;
          countryCode = request.outgoingObj.countryCode;
          isOnOutgoingCall = true;
          onOutgoingCallClick();
      } else if (request.dialCode) {
        dialCode = request.dialCode;
      } else if (request.muteCall) {
        console.log('call mute ' + request.muteCall.muteCallFlag);
        muteValue = request.muteCall.muteCallFlag;
      } else if (request.toggleMute) {
        outgoingConnection.mute(request.toggleMute.toggleValue);
      }
    }   
  });

  function pageInit(isTokenAvailable) {
    deviceView = new DeviceView();
    // root.appendChild(deviceView.render());
    if (deviceView) {
      deviceView.setupWorker();
      deviceView.setupDevice();
    }
    console.log('INFO', 'App rendered.');
    window.deviceView = deviceView;
  }

  function onOutgoingCallClick() {
    console.log('countryCode ' + countryCode);
    var outgoingNumber = countryCode + fullNumber;
    outgoingConnection = deviceView.device.connect({
      phoneNumber: outgoingNumber,
      isoCode: isoCode
    });
    console.log(outgoingConnection);

    outgoingConnection.on('accept', function(connectionconn) {
      console.log('Set Timer called from call accept handler');
      // calledTimer = setInterval(setTime, 1000);
    });

    outgoingConnection.on('disconnect', function(connectionconn) {
      // console.log('outgoing call disconnected');
      countryCode = '';
      if (calledTimer) {
        clearInterval(calledTimer);
      }
    });

    outgoingConnection.on('cancel', function(connectionconn) {
      countryCode = '';
      // console.log("the call has cancelled");
    });

    outgoingConnection.on('open', connection => {
      // console.log('outgoing conn open');
    });
  }

  function getJson(url, callback) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      const errMsg = 'Cannot get token from the url provided ' + url;
      if (this.readyState == 4 && this.status == 200) {
        try {
          callback(null, JSON.parse(this.responseText));
        } catch {
          callback(errMsg);  
        }
      }
    };
    xmlhttp.open('POST', url, true);
    var formData = new FormData();
    formData.append('identity',  userID);

    try {
      xmlhttp.send(formData);
    } catch(err) { 
      console.log("Generate Token Failed");
    }
  }

  function refreshJWT(url, callback) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      const errMsg = 'Cannot get token from the url provided ' + url;
      if (this.readyState == 4 && this.status == 200) {
        try {
          callback(null, JSON.parse(this.responseText));
        } catch {
          callback(errMsg);  
        }
      }
    };
    xmlhttp.open('POST', url, true);
    var formData = new FormData();
    formData.append('access_token',  userToken);

    try {
      xmlhttp.send(formData);
    } catch(err) { 
      console.log("Generate Capability Token Failed");
    }
  }

  function setTime() {
    console.log('setTime called');
    ++totalSeconds;
  }

  function changeIcon() {
    setTimeout(function(){ 
      chrome.browserAction.setIcon({path: icons.small});
    }, 200);
    setTimeout(function(){ 
      chrome.browserAction.setIcon({path: icons.enabled});
    }, 400);
  }

  function resetTimer() {
    totalSeconds = 0;
  }

  function resetValues() {
    console.log('reset values called');
    clearInterval(calledTimer);
    clearInterval(iconChanger);
    resetTimer();
    setTimeout(function(){ 
      chrome.browserAction.setIcon({path: icons.disabled});
    }, 1500);
    onCall = false;
    isIncomingCall = false;
    isOnOutgoingCall = false;
    outgoingConnection = null;
    chrome.runtime.sendMessage({output: 'callRejected'});
  }

  class DeviceView {
    constructor() {
     this.tokenUrlEl = environment.twilioToken;
    // this.tokenUrlEl = 'https://staging-pb.engineer.ai/api/public/twilio/generate_token';
    }

    setupDevice(onReady) {
      console.log('INFO', 'Setting up device');
      getJson(this.tokenUrlEl, (err, data) => {
        if (data) {
          deviceToken = data.token;
          chrome.runtime.sendMessage({twilioToken: deviceToken});
          console.log('token ' + data.token);
          this.identity = data.identity;
          this.device = new Twilio.Device(data.token, {
            debug: true, enableRingingState: true
          }, error => {
            console.log('token err ' + error);
          });
          // console.log(this.device);
          this.setupHandlers(onReady);
        } else {
          return console.log('ERROR', err);
        }
      }, error => {
        console.log('err chk' + error);
      });
    }
 
    setupWorker(readyWorker) {
       // let WORKER_TOKEN = data.token;
      worker = new Twilio.TaskRouter.Worker(workerToken, false, null, null, true);
      if (worker) {
         if (worker.activityName !== 'Available') {
           worker.update(
             "ActivitySid",
             available_Activity_SID,
             function (error, worker) {
               if (error) {
                 console.log(error.code);
                 console.log(error.message);
               } else {
                 console.log(worker.activityName);
               }
             }
           );
         }
        
         console.log(worker);
         worker.on("ready", function(worker) {
           console.log(worker.available)       // true
         });
 
         worker.on("token.expired", function() {
           console.log("updating token");
           var capabilityToken;
           refreshJWT('https://staging-pb.engineer.ai/api/public/twilio/capability_token', (err, data) => {
             if (data) {
               capabilityToken = data.token; 
               worker.updateToken(capabilityToken);
             } else {
               return console.log('ERROR', err);
             }
           }, error => {
             console.log('err chk' + error);
           });
         });
 
         worker.on("connected", function() {
           console.log("Websocket has connected");
         });
 
         worker.on("disconnected", function() {
           console.log("Websocket has disconnected");
         });
 
         worker.on("error", function(error) {
           console.log(error.response);
           console.log(error.message);
           console.log("Websocket had an error: "+ error.response + " with message: "+error.message);
         });
         
         worker.on("task.wrapup", function(task) {
           isOnReservation = false;
           resetValues();
           if (task.assignmentStatus === 'wrapping') {
              worker.completeTask(task.sid);
           }
           console.log(task);
           chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}});
         });
 
        //  worker.on("activity.update", function(worker) {
        //    console.log(worker.activityName)   // 'Reserved'
        //    console.log(worker.available)       // false
        //  });
 
        //  worker.on("attributes.update", function(worker) {
        //    console.log(worker.activityName)    // 'Reserved'
        //    console.log(worker.available)       // false
        //  });
 
        //  worker.on("capacity.update", function(channel) {
        //    console.log(channel);
        //  }); 
 
         worker.on("reservation.created", function(reservation) {
           if(outgoingConnection) {
             isIncomingCall = false;
               reservation.reject(
                 function(error, reservation) {
                     if(error) {
                         console.log(error.code);
                         console.log(error.message);
                         return;
                     }
                     console.log("reservation rejected");
                     for (var property in reservation) {
                         console.log(property+" : "+reservation[property]);
                     }
                 }
               );
            } else {
              isOnReservation = true;
              console.log("reservation.created " + reservation.reservationStatus + '  ' + reservation.task.assignmentStatus)        // 1;
              currentReservation = reservation;
              alertSound.loop = true;
              alertSound.play();
              if (iconChanger) {
                clearInterval(iconChanger);
              }
              iconChanger = setInterval(changeIcon, 500);
              isIncomingCall = true;
              chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}, ReservationCreated: reservation});
              console.log("reservation.created " + reservation);
            }
         });
 
         worker.on("reservation.accepted", function(reservation) {
           console.log("reservation.accepted " + reservation);
         });
 
         worker.on("reservation.rejected", function(reservation) {
           isOnReservation = false;
           chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}});  
           console.log("reservation.rejected " + reservation);
         });
 
         worker.on("reservation.timeout", function(reservation) {
           isOnReservation = false;
           chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}});  
           alertSound.pause();
           clearInterval(iconChanger);
           setTimeout(function(){ 
             chrome.browserAction.setIcon({path: icons.disabled});
           }, 1000);
           isIncomingCall = false;
           console.log("reservation.timeout " + reservation);
           chrome.runtime.sendMessage({output: 'callRejected'});
         });
 
         worker.on("reservation.canceled", function(reservation) {
           isOnReservation = false;
           chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}});  
           alertSound.pause();
           clearInterval(iconChanger);
           setTimeout(function(){ 
             chrome.browserAction.setIcon({path: icons.disabled});
           }, 1000);
           isIncomingCall = false;
           console.log("reservation.canceled " + reservation);
           chrome.runtime.sendMessage({output: 'callRejected'});
         });
 
         worker.on("reservation.rescinded", function(reservation) {
           isOnReservation = false;
           chrome.runtime.sendMessage({isRervationActive: {isReservationAvailable: isOnReservation}});  
           alertSound.pause();
          //  clearInterval(iconChanger);
          //  setTimeout(function(){ 
          //    chrome.browserAction.setIcon({path: icons.disabled});
          //  }, 1000);
           isIncomingCall = false;
           console.log("reservation.rescinded " + reservation); 
           chrome.runtime.sendMessage({output: 'callRejected'});
         });
      }
    }

    setupHandlers(onReady) {
      console.log('setup handler');
      this.device.on('ready', (connection) => {
        console.log('INFO', 'Device ready');
        deviceOffline = false;  
        setTimeout(function(){ 
          chrome.browserAction.setIcon({path: icons.disabled});
        }, 1000);
        deviceSetupReady = true;
        onReady && onReady(this);
        deviceConnection = connection;
        twilioConnection = deviceConnection;
        deviceObject = deviceView;
      });

      this.device.on('offline', () => {
        console.log('INFO', 'Device Offline');
        alertSound.pause();
        clearInterval(iconChanger);
        setTimeout(function(){ 
          chrome.browserAction.setIcon({path: icons.disabled});
        }, 1000);
        clearInterval(calledTimer);
        onCall = false;
        resetTimer();
        deviceOffline = true;  
        clearInterval(iconChanger);
        setTimeout(function(){ 
          chrome.browserAction.setIcon({path: icons.offline});
        }, 1500);
      });

      this.device.on('error', (error) => {
        alertSound.pause();
        isOnOutgoingCall = false;
        // clearInterval(iconChanger);
        setTimeout(function(){ 
          chrome.browserAction.setIcon({path: icons.disabled});
        }, 1000);
        console.log('ERROR', `${error.message} (${error.code})`);
        chrome.runtime.sendMessage({output: 'callRejected'});
        if (error && (error.code === 31205 || error.code === 31202)){
          pageInit();
          console.log('INFO Token Expired. Re-Initializing Device');
        } else if (error && (error.code === 31000 || error.code === 31005)){
          console.log('INFO Web Socket Error Occured');
        }
      });
  
      this.device.on('connect', () => {
        console.log('INFO', 'Connection established');
        if (!isOnReservation) {
          calledTimer = setInterval(setTime, 1000);
          console.log('timer started from device onconnect ' + totalSeconds);
          isOnOutgoingCall = true;
          chrome.runtime.sendMessage({output: 'outgoingCallPicked'});
        }
      });
  
      this.device.on('disconnect', () => {
        console.log('INFO', 'Connection Disconnected');
        if (!isOnReservation) {
          chrome.runtime.sendMessage({output: 'outgoingCallDropped'});
          // clearInterval(calledTimer);
          resetValues();        
          outgoingConnection = null;
          isOnOutgoingCall = false;
          console.log('INFO', 'Call disconnected');
          this.device.disconnectAll();
        }       
      });
  
      this.device.on('cancel', () => {
        // resetValues();
        console.log('INFO', 'Call cancelled');
      });
  
      this.device.on('incoming', (connection) => {
        connection.accept(); 
      });
    } 
  }
// })();