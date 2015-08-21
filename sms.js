
var env = process.env.NODE_ENV || 'dev';
if(env == 'dev'){
    require('dotenv').load();
}

var config = {
    "twilio_SID": process.env.TWILIO_SID,
    "twilio_auth_token": process.env.TWILIO_AUTH_TOKEN,
    "twilio_number": process.env.TWILIO_NUMBER
}

var twilio = require('twilio');
var client = twilio(config["twilio_SID"], config["twilio_auth_token"]);

module.exports = {
    send: function(number, message){
        client.sendMessage({

            to: number,
            from: config["twilio_number"],
            body: message

        }, function(err, responseData) {

            if (err) {
                console.log(err);
            }
            else { // "err" is an error received during the request, if any

                // "responseData" is a JavaScript object containing data received from Twilio.
                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                console.log(responseData.from); // outputs "+14506667788"
                console.log(responseData.body); // outputs "word to your mother."

            }
        });
    }
}