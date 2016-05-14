var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var port = 80;
app.listen(port);
console.log('Listening on port ' + port);

function handler (req, res) {
  var rfile;
  switch (req.url) {
    case '/':
      rfile = 'public/index.html';
      break;
    case '/admin.js':
      rfile = 'public/admin.js';
      break;
    case '/user.js':
      rfile = 'public/user.js';
      break;
    case '/notify.mp3':
      rfile = 'public/notify.mp3';
      break;
    default:
      rfile = 'public/notify.html';
  }
  fs.readFile(rfile, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}

var users = { };
var nus = 0;

io.on('connection', function (socket, url) {
  socket.on('uverify', function (data) {
    for (var u in users) {
      if (users[u].url == data.url) {
        socket.emit('game', { msg: 'confirm', sock: users[u].id });
        users[u].clients[users[u].cnum] = socket.id;
        users[u].cnum++;
      }
    }
  });
  socket.on('register', function (data) {
    var gennum = Math.random().toString(36).substring(7);
    for (var k in users) {
      if (users[k].url === gennum) {
        socket.emit('msg', { msg: "Something went wrong, please refresh and try again." });
        return;
      }
      if (users[k].id == socket.id) {
        socket.emit('msg', { msg: "Error: Socket already registered" });
        return;
      }
    }
    users[nus] = { };
    users[nus].clients = { };
    users[nus].cnum = 0;
    users[nus].url = gennum;
    users[nus].id = socket.id;
    nus++;
    socket.emit('game', { msg: 'registered', id: gennum });
    //io.to(adminid).emit('auser', { user: data.nickname, id: socket.id });
  });
  socket.on('notify', function(data) {
    io.to(data.sock).emit('game', { msg: 'notify' });
  });
  socket.on('disconnect', function() {
    for (var k in users) {
      if (users[k].id === socket.id) {
        for (var m in users[k].clients) {
          io.to(users[k].clients[m]).emit('game', { msg: 'lbreak' });
        }
        delete users[k];
      }
    }
  });
});
