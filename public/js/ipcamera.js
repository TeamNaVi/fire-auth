// Streaming
// rtsp streaming
const rtspStream = require("node-rtsp-stream");

//@desc     Camera Authentication
var ip_address = "192.168.0.254"; //NOTE: replace it with your camera IP address

//@desc     Camera username and password
var username = "root";
var password = "root";

//@desc     A channel of camera stream
stream = new rtspStream({
  //streamUrl: 'rtsp://' + username + ':' + password + '@' + ip_address +':554/cam0_0/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',
  streamUrl:
    "rtsp://" + username + ":" + password + "@" + ip_address + ":554/cam0_0",
  //wsPort: 9999
  wsPort: 8080,
});