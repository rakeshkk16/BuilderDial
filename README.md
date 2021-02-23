# Builder-Dial-extension

Testing twilio-client.js as a chrome extension. This is for my personal testing only. Please use only use this as a reference.

![Example UI](UI.png)

## Installation
1. Clone this repository.
2. Install to chrome browser per instructions outlined here https://developer.chrome.com/extensions/getstarted

## Getting Tokens
This extension requires a token url (as shown in the above UI). This url should be a `GET` REST API which returns your token and identity. This token will be used to initialize the `Device` object.

Example Response from the url:
```
  {
    "token": "eyJhbGciOiJIUz....",
    "identity": "myIdentity1"
  }
```

## Making a Call
1. Enter a phone number
2. Click `Call` button

## Receiving a Call
1. Click `Setup Device` or make sure an initial outgoing call has been made.
2. Call the phone number associated with the identity used when a token was generated.


## Detailed Description
Builder Extension for interaction between client and Builder team using incoming outgoing calls.



## Features

- Used ReactJs to write chrome extension
- Injecting extension to host page as content script
- Utilized the Chrome messaging API
- Isolated extension CSS using Iframe

## Adding React app extension to Chrome

In Chrome browser, go to chrome://extensions page and switch on developer mode. This enables the ability to locally install a Chrome extension.

<img src="https://cdn-images-1.medium.com/max/1600/1*OaygCwLSwLakyTqCADbmDw.png" />

Now click on the `LOAD UNPACKED` and browse to `[PROJECT_HOME]\build` ,This will install the React app as a Chrome extension.

When you go to any website and click on extension icon, injected page will toggle.

<img src="https://cdn-images-1.medium.com/max/1600/1*bXJYfvrcHDWKwUZCrPI-8w.png" />


