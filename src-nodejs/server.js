// Node-Svc. Simple microservice. Includes both Express and Fetch. Calls itself, 
// or can be replicated and will round-robin requests among peers.  

'use strict';

// vary these constants according to where you are running (GCS, VMs, K8S) and how many VMs you have, if that's the lesson)
// to do: this should be a command-line parameter that lets the app know how it is running
//const arrNodes = [ "localhost" ]                                    // for testing on GCS
//const arrNodes = [ "node-svc-01" ]                                  // for 1 VM
const arrNodes = [ "node-svc-01", "node-svc-02" ]                   // for 2 VMs
//const arrNodes = [ "node-svc-01", "node-svc-02" , "node-svc-03" ]   // for 3 VMs
//const arrNodes = [ process.env.NODE_SVC_PUBLIC_SERVICE_HOST  ];       //  use this for K8S

console.log("service host is " + arrNodes[0]);

const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')

// Constants
const PORT = 30100;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// shuts down application
app.get('/999', (req, res) => {
 (async () => {
   console.warn("***SHUTDOWN SIGNAL***");
   res.write("Shutting down.");

   res.status(200).end();
   return process.exit(999);
  })();
})

// simplest get; recursion end point
app.get('/0?', (req, res) => {     // matches either / or /0
  (async () => {
    // A simple change is to alter the returned data, 
    // e.g. change "ThisAction" to "Action"
    res.write(dateIPStamp({ "Action":"GET" }, req.ip));
    res.status(200).end();
    console.log('Console: / Server returned success on get.');
  })();
});

// app.get('/:depth(\d+)', (req, res) => {   // WHY does this not work
app.get('/:depth(\\d+)/', (req, res) => {   // everything else but / or /0
  console.log("/n GET, making GET subrequest");
  let strURL = buildURL(req.params.depth);
  (async () => {
	const response = await fetch(strURL);
	const json = await response.json();
	console.log(json);
        res.write(dateIPStamp(json, req.ip));  
        res.status(200).end();
        console.log('Console: /1 Server returned success on get.');
  })();
});


app.post('/0?', (req, res) => {     // matches either / or /0
  console.log ("Console: entered / post");
  console.log("Console: / received " + JSON.stringify(req.body));
  let recd = req.body;
  recd.action = "POST";
  let stampedRecd = dateIPStamp(recd, req.ip);
  res.write(stampedRecd); //
  res.status(200).end();
  console.log('Console: / returned ' + stampedRecd);
});

app.post('/:depth(\\d+)/', (req, res) => {
  console.log ("Console: /n POST");
  let strURL = buildURL(req.params.depth);
  (async () => {
        console.log("/n POST trying subrequest");
        const recd = await req.body;
        const headers = {"Content-Type": "application/json"};
        const postData = await JSON.stringify({recd});
        const response = await fetch(strURL, { method: 'POST', headers: headers, body: postData});
        const json = await response.json();
        console.log(json);
        res.write(dateIPStamp(json, req.ip));  
        res.status(200).end();
        console.log('Console: /1 Server returned success on get.');
  })();
});

///////////////////////////////////////////////////
///////////// Main body////////////////////////////
///////////////////////////////////////////////////

app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Console: request is testing a simple self-get')

fetch('http://localhost:' + PORT)
  .then(response => response.json())
  .then(data => console.log(data));

// test a simple self-post
console.log('Console: request is testing a simple self-post')

const url ='http://localhost:' + PORT;
const headers = {
  "Content-Type": "application/json"
};
const postData = JSON.stringify({
  "firstName": "myFirstName",
  "lastName": "myLastName"
});

fetch(url, { method: 'POST', headers: headers, body: postData})
  .then((res) => {
     return res.json()
})
.then((json) => {
  console.log(json);
});

function dateIPStamp(recdJSON, someIP) {
  console.log ("DateIPStamp reached with " + JSON.stringify(recdJSON) + " " + someIP);
  let now = new Date();
  if (!recdJSON.hasOwnProperty("arrTimeStamp")) {
  recdJSON.arrTimeStamp = [ someIP + " " + now ];
  } else {
  recdJSON["arrTimeStamp"].push(someIP + " " + now)
  };
  let strReturnJSON = JSON.stringify(recdJSON);
  return(strReturnJSON);
  
}
 
function buildURL (strLevel) {


  // what is the formula for which node to call? 
  // given x levels and n nodes
  // x % n  where x>n, else n
  
      
  let intCurrLevel = parseInt(strLevel);
  let nextLevel = intCurrLevel - 1;
  let numNodes = arrNodes.length; // to be derived from arrNodes
  let nextNode = nextLevel >= numNodes ? nextLevel % numNodes : nextLevel;
  let strURL = "http://"+ arrNodes[nextNode] + ":" + PORT + "/" + nextLevel;
    
  console.log ("returning URL " + strURL);
   return(strURL);

}

