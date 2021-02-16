const Staging_URL = 'https://staging-pb.engineer.ai/api/';
const Prod_URL = 'https://pb.engineer.ai/api/';
const Local_URL = 'https://9f8c0fffdba9.ngrok.io';
const Release_Stage = Staging_URL;



var environment = {

    signInUrl :  Release_Stage + 'twilio/sign_in',
    signOutUrl : Release_Stage + 'twilio/sign_out',
    signUpUrl : Release_Stage + 'twilio/sign_up',
    reservationDequeue : Release_Stage + 'public/twilio/status_callback',
    twilioToken : Release_Stage + 'public/twilio/generate_token',
    capabilityToken : Release_Stage + 'public/twilio/capability_token',
    changePwdUrl : Release_Stage + 'public/twilio/change_password',
    callLogs : Release_Stage + 'public/call/call_logs',
    missedCallAction: Release_Stage + 'public/call/missed_call_action'
  }