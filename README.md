# Purpose
Use a Firebase Cloud Function to collect, log, and respond with the requestor's IP address and other meta info.

## Usage
If an app requires logging a user's IP address for metrics, security logs, audit trails, etc, it can trigger this HTTP function via a GET request.

### Examples

`GET https://us-central1-ip-address-info.cloudfunctions.net/getIpAddrInfo`

If a `uid` parameter is provided, the user's UID can be logged as well.  This information could be passed in after successful authentication.

`GET https://us-central1-ip-address-info.cloudfunctions.net/getIpAddrInfo?uid=abc123`

```
auth.onAuthStateChanged((user) => {
  fetch(`https://us-central1-ip-address-info.cloudfunctions.net/getIpAddrInfo?uid=${user.uid}`)
    .then((response) => {
       console.log('Response = ', response.json());
     })
});
```

While perhaps not required in a real app, the function will return to the caller all available meta information.  This can be modified as needed to suit any use case.

### Response
```
{
  "data": {
    "city": "dallas",
    "coordinates": "32.776664,-96.796988",
    "country": "US",
    "ipAddress": "205.185.214.246",
    "rawHeaders": [
      "Host",
      "us-central1-ip-address-info.cloudfunctions.net",
      "User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding",
      "gzip, deflate, br",
      "Accept-Language",
      "en-US,en;q=0.5",
      "Dnt",
      "1",
      "Function-Execution-Id",
      "vm6xzjq9oi06",
      "If-None-Match",
      "W/\"58a-WO5guEnoa1nVMTXtuwmwxPQtJWo\"",
      "Upgrade-Insecure-Requests",
      "1",
      "X-Appengine-Api-Ticket",
      "d21c5e2d02199fc5",
      "X-Appengine-City",
      "dallas",
      "X-Appengine-Citylatlong",
      "32.776664,-96.796988",
      "X-Appengine-Country",
      "US",
      "X-Appengine-Default-Version-Hostname",
      "q7ab5b185cafaefa5-tp.appspot.com",
      "X-Appengine-Https",
      "on",
      "X-Appengine-Region",
      "tx",
      "X-Appengine-Request-Log-Id",
      "5c2b1fa100ff073989d4c08df70001737e71376162356231383563616661656661352d7470000162323138363066616232326565376261663636653539316661363366333733303a33000100",
      "X-Appengine-User-Ip",
      "205.185.214.246",
      "X-Cloud-Trace-Context",
      "0c57630f6bae7ea36dcaab7c30527f55/7783831052114685448;o=1",
      "X-Forwarded-For",
      "205.185.214.246",
      "X-Forwarded-For",
      "205.185.214.246",
      "X-Forwarded-Proto",
      "https"
    ],
    "region": "tx",
    "uid": "abc123",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0"
  },
  "success": true
}
```

## Setup

To use this HTTP function, setup as follows:

### Firebase CLI
Install Firebase Tools globally
```
nvm use 8.12.0
npm install -g firebase-tools
```

### Cloning and Configuring
```
git clone git@github.com:calendee/firebase-log-ip-address.git
cd firebase-log-ip-address
npm install
cd functions
npm install
```

**NOTE:** At this point, modify the `.firebaserc` file to point to the correct firebase project

### Firebase Login

To use the Firebase CLI, you'll need to login.  

```
firebase login
```

A browser will open asking for your login credentials (those used to access the Firebase console).  Once logged in, you'll be able to perform other Firebase command line functions.

## Development

The HTTP function can be directly edited in the `functions/src/index.ts` file.  Because the project uses TypeScript, the server will NOT detect changes to this file.  In order for changes to take effect, run `tsc` in the `functions` directory after saving all changes.  The server will then detect the changes.

### Testing HTTP Functions

To test the `getIpAddrInfo` HTTP function, serve it via the local shell as follows:

```
cd functions
npm run serve
```

The emulator will provide an output that displays the local URL for each function:

```
> functions@ serve /Users/jn/Documents/Apps/get-ip-addr-info/functions
> npm run build && firebase serve --only functions


> functions@ build /Users/jn/Documents/Apps/get-ip-addr-info/functions
> tsc


=== Serving from '/Users/jn/Documents/Apps/get-ip-addr-info'...

i  functions: Preparing to emulate functions.
Warning: You're using Node.js v8.12.0 but Google Cloud Functions only supports v6.11.5.
✔  functions: getIpAddrInfo: http://localhost:5000/ip-address-info/us-central1/getIpAddrInfo
```

Using a browser, cURL, Paw, PostMan, or some other HTTP tool, generate a `GET` request to the URL provided in the emulator. 

Example: 

```
curl http://localhost:5000/ip-address-info/us-central1/getIpAddrInfo
```

## Deploying

**NOTE**: Deploying will trigger `tslint` verifications.  If a function has code that does not meet the syntax requirements, it will be logged out and the deployment will not continue.  All syntax validations must be fixed before deployment can be completed.

```
cd functions
npm run deploy
```
