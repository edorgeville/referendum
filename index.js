
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
var censoredNumbers = [];

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

if(process.env.CHEAT == "TRUE"){
    app.get('/triche/oui', function(req, res){
        vote(null, 'yes');
        res.send("That's it mon gars, c'est d'même qu'on va l'avouèr notre pays. V'la un hot dog gratiss'.");
    });

    app.get('/triche/non', function(req, res){
        vote(null, 'no');
        res.send("Fraude électorale effectuée avec succès. Confirmation de dépôt de pôt-de-vin #" + Math.floor(Math.random()*100000000000) + "-" + Math.floor(Math.random()*1000) + ".");
    });
}

app.set('port', (process.env.PORT || 1337));

var server = app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('votes', votes);
    socket.emit('number', process.env.TWILIO_NUMBER);
    io.emit('numbers', numbers);
});





function numberVoted(number){
    return (numbers.indexOf(number) > -1);
}

function vote(number, answer){

    votes[answer]++;

    var percentages = getPercentages();

    if(number){
        if(answer == 'yes'){
            sms.send(number, 'Vous avez voté oui. Score: OUI ' + percentages.yes + '% vs. NON ' + percentages.no + '%');
        }
        else if(answer == 'no'){
            sms.send(number, 'Vous avez voté non. Score: OUI ' + percentages.yes + '% vs. NON ' + percentages.no + '%');
        }
        else{
            return 1;
        }
    }
    if(number){
        numbers.push(number);
        censoredNumbers.push("xxx-xxx-" + number.substr(number.length - 4));
    }
    else{
        censoredNumbers.push("xxx-xxx-xxxx");
    }

    io.emit('votes', votes);
    io.emit('numbers', censoredNumbers);
    io.emit('percentages', percentages);
}

function getPercentages(){
    return {
        yes: votes.yes / (votes.yes + votes.no) * 100,
        no: votes.no / (votes.yes + votes.no) * 100
    }
}