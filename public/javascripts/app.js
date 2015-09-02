var socket = io.connect(window.location.origin);
window.votes = {};

socket.on('votes', function(votes){
    console.log(votes);
    window.votes = votes;
    $('#votes').html("OUI " + votes.yes + " vs " + votes.no + " NON");
});

socket.on('percentages', function(percentages){
    $('.column .yes').css('height', percentages.yes + '%');
    $('.column .no').css('height', percentages.no + '%');
    $('.column-no .percentage').html(percentages.no + '%');
    $('.column-yes .percentage').html(percentages.yes + '%');
});

socket.on('animate', function(side){
    $('.column .' + side + ' .img').addClass('spin');
    setTimeout(function(){
        $('.column .' + side + ' .img').removeClass('spin');
    }, 1000);
})

// socket.on('number', function(number){
//     $('#number').html(number);
//     $('#qr').attr('src', "http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=sms:" + number.replace('+', ''));
// });


// socket.on('numbers', function(numbers){
//     var html = "";
//     numbers.reverse();
//     $.each(numbers, function(i, number){
//         html += "<li>" + number + "</li>";
//     });
//     $('#numbers').html(html);
// });
