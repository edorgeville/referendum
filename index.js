
var sms = require('./sms');

var twilio = require('twilio');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var votes = {
    yes: 0,
    no: 0
};

var numbers = [];

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', function(req, res){

    console.log('Recieved an SMS');
    var message = req.body;
    var answer = message.Body.toLowerCase();
    var voter = message.From;

    if(numberVoted(voter)) {
        sms.send(voter, 'Désolé, vous avez déjà voté.')
    }
    else{
        if(answer == 'oui'){
            vote(voter, 'yes');
        }else if (answer == 'non'){
            vote(voter, 'no');
        }else{
            sms.send(voter, 'Désolé, je n\'ai pas bien compris. Veuillez envoyer OUI ou NON pour voter.');
        }
    }

    //Create TwiML response
    var twiml = new twilio.TwimlResponse();
    twiml.say('');

    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());

});

var server = app.listen(process.env.PORT || 1337, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

function numberVoted(number){
    return (numbers.indexOf(number) > -1);
}

function vote(number, answer){
    if(answer == 'yes'){
        sms.send(number, 'Vous avez voté pour l\'indépendence du Québec.');
    }
    else if(answer == 'no'){
        sms.send(number, 'Vous avez voté contre l\'indépendence du Québec.');
    }
    else{
        return 1;
    }
    votes[answer]++;
    numbers.push(number);
}