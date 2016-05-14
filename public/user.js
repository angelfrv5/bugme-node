var parser = document.createElement('a');
parser.href = window.location.href;
var socket = io.connect(parser.host);
socket.emit('uverify', { url: parser.pathname.substr(1) });
socket.on('msg', function (data) {
	alert(data.msg);
});
function ping(sock) {
	socket.emit('notify', { sock: sock });
}
socket.on('game', function(data) {
	switch(data.msg) {
    case 'confirm':
      document.getElementById('container').innerHTML = '<button onclick="ping(\'' + data.sock + '\');">Bug Them!</button>';
      break;
    case 'lbreak':
      document.getElementById('container').innerHTML = '<p>Link destroyed</p>';
      break;
  }
});
