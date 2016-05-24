// include a couple native Node.js modules
const https = require('https');
const url = require('url');

////// ENTER YOUR LOSANT WEBHOOK URL HERE! //////
const webhookUrl = 'https://triggers.losant.com/webhooks/XXXXXXXX';

const parsedUrl = url.parse(webhookUrl);

exports.handler = function(event, context) {
    // want to see the console logs? Click the "Monitoring" tab and then the "View logs in CloudWatch" link.
    console.log('start request to ' + webhookUrl);

    // Amazon's IoT button sends three parameters when it is pressed ...
    var body = JSON.stringify({
        clickType: event.clickType, // (string) the type of press; can be "SINGLE", "DOUBLE" or "LONG"
        serialNumber: event.serialNumber, // (string) device's serial number, from the back of the button.
        batteryVoltage: event.batteryVoltage // (string) device's voltage level in millivolts. e.g. "1567mV"
    });

    var options = {
        hostname: parsedUrl.host,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // required by Losant
            'Content-Length': body.length
        }
    };

    var req = https.request(options, function(res) {
        // if you'd like to execute any additional AWS functions,
        // do them here.
        console.log("Got response: " + res.statusCode);
        context.succeed(); // must call succeed(), fail() or done() at the end of our code
    }).on('error', function(e) {
        // if you'd like to handle an error case,
        // do it here
        console.log("Got error: " + e.message);
        context.done(null, 'FAILURE');
    });
    req.write(body); // append our body to the request
    console.log('end request to ' + webhookUrl); // this will print to the console before our response since it's an asynchronous request
}
