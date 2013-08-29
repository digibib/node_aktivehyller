// Initialize
var ws = new WebSocket("ws://localhost:4567/ws");
var request;

$('button#avbryt-knapp').on('click', function() {
  $('#overlay').hide();
  $('#vi-leter').hide();
  if(request) {request.abort();} //abort running requests
});

// loading animation
i = 0;
setInterval(function() {
    i = ++i % 4;
    $("#loading").html(""+Array(i+1).join("."));
}, 500);

ws.onmessage = function(evt) {
  if (evt.data == "tag removed") {
    // do nothing...for now
  } else {
    // when titlenr is received from server via websocket:
    // show overlay
    $('button#retry-knapp').hide();
    $('#overlay').show();
    $('button#avbryt-knapp').html("#{t.cancel}");
    $('#vi-leter p').html("#{t.looking} <span id=\"loading\"></span>");
    $('#vi-leter').show();

    check_format = $.getJSON('/checkformat/'+evt.data);
    check_format.done(function(data) {
      if (data.accepted_format) {
        $('div#vi-leter p').html("#{t.fetching_info} \"" + data.title + '" <span id="loading"></span>' );

        //hent all info til omtalevisning her
        request = $.get('/populate/'+evt.data);

        request.done(function(data) {
        $.get('/copy', function(data) {
            window.location.replace("/omtale");
            console.log(data);
          });
        });

        request.fail(function(message) {
          console.log(message);
          $('div#vi-leter p').html("#{t.nothing_found}");
          $('button#avbryt-knapp').html('OK');
        });

      } else {
        $('div#vi-leter p').html("#{t.wrong_format}");
        $('button#avbryt-knapp').html('OK');
      };
    });
  }
}

ws.onclose = function() {
  console.log("Websocket connection lost!");
}

ws.onopen = function() {
  console.log("Websocket connected!");
}
