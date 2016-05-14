var parser = document.createElement('a');
parser.href = window.location.href;
var socket = io.connect(parser.host);
var audio = new Audio('notify.mp3');
socket.on('msg', function (data) {
	alert(data.msg);
});
function register() {
	socket.emit('register');
}
socket.on('game', function(data) {
	switch(data.msg) {
    case 'registered':
      document.getElementById('container').innerHTML = '<a href="' + window.location.href + data.id + '">Share this link</a>';
      break;
    case 'notify':
			audio.play();
      alert('Notified!');
      break;
  }
});
